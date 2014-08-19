package io.github.luics.hybrid;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler.Callback;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.webkit.JsPromptResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Button;

@SuppressLint("NewApi")
public class MainActivity extends Activity {
	private static final String TAG = "Bridge";
	private static final String CALL_BY_NATIVE = "javascript:(function(){ Bridge.callByNative(%s) })()";
	WebView webView;
	Button button;
	Map<String, Callback> callbacks = new HashMap<String, Callback>();
	int guid = 0;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		webView = (WebView) this.findViewById(R.id.webView1);
		button = (Button) this.findViewById(R.id.button1);

		// webView.addJavascriptInterface(new InJavaScriptLocalObj(),
		// "local_obj");
		webView.getSettings().setJavaScriptEnabled(true);
		webView.setWebChromeClient(new MyChromeClient());
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
		    WebView.setWebContentsDebuggingEnabled(true);
		}
		webView.loadUrl("file:///android_asset/index.html");

		button.setOnClickListener(new View.OnClickListener() {
			public void onClick(View v) {
				handleNative("window.innerWidth", new Callback() {
					@Override
					public boolean handleMessage(Message msg) {
						String ret = msg.getData().getString("ret");
						Log.i(TAG, "native callback: " + ret);

						new AlertDialog.Builder(MainActivity.this).setIcon(R.drawable.ic_launcher)
								.setTitle("Native 对话框").setMessage("window.innerWidth = " + ret)
								.setPositiveButton("确认", new DialogInterface.OnClickListener() {
									@Override
									public void onClick(DialogInterface dialog, int which) {
									}
								}).show();

						return false;
					}
				});
			}
		});
	}

	private class MyChromeClient extends WebChromeClient {
		@Override
		public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
			handleWeb(message);
			result.confirm("");
			return true;
		}
	}

	void handleNative(String script, Callback callback) {
		Log.i(TAG, "handleNative script: " + script);
		try {
			// 输入参数
			JSONObject input = new JSONObject();
			String token = "" + ++guid;
			input.put("token", token);
			input.put("script", script);
			callbacks.put(token, callback);

			// 调用 Bridge
			webView.loadUrl(String.format(CALL_BY_NATIVE, input.toString()));
		} catch (JSONException e) {
			Log.e(TAG, e.toString());
		}
	}

	void handleWeb(String message) {
		Log.i(TAG, "handleWeb input: " + message);
		try {
			// 输入参数
			JSONObject input = new JSONObject(message);
			String token = input.getString("token");
			String name = input.optString("name", "");

			// Native 调用 Web
			if (name.equals("")) {
				String ret = input.getString("ret");

				Bundle data = new Bundle();
				data.putString("ret", ret);
				Message msg = new Message();
				msg.setData(data);
				callbacks.get(token).handleMessage(msg);
			}
			// Web 调用 Native
			else {
				JSONObject param = input.getJSONObject("param");

				// 输出参数
				JSONObject output = new JSONObject();
				JSONObject ret = new JSONObject();
				output.put("token", token);
				output.put("ret", ret);
				if (name.equals("model")) {
					ret.put("result", Build.MODEL);
				} else if (name.equals("add")) {
					ret.put("result", param.getInt("num1") + param.getInt("num2"));
				}

				// 调用 Bridge
				webView.loadUrl(String.format(CALL_BY_NATIVE, output.toString()));
			}
		} catch (JSONException e) {
			Log.e(TAG, e.toString());
		}
	}

}
