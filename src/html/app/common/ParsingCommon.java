/**
 * JSON STRING ���� JAVA OBJECT ���·� ��ȯ
 * <pre>
 * <b>History</b>
 * 	�ۼ���: �̿빮
 * 	���� : 1.0
 *  ������ : 2019-01-29
 */
package html.app.common;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

public class ParsingCommon {
	
	public static Gson gson = new GsonBuilder().setPrettyPrinting().create();
	
	public static String getJsonStr(HttpServletRequest req) {
		StringBuffer json = new StringBuffer();
		String line = null;
		try {
			BufferedReader reader = req.getReader();
			while((line = reader.readLine()) != null) {
				json.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(json.toString());
		return json.toString();
	}
	
	public static String jsonEtoStr(JsonElement jsonElement, String key) {
		return jsonElement.getAsJsonObject().get(key).toString();
	}
	
	public static String jsonStrToStr(String str) {
		return (String) gson.fromJson(str, String.class);
	}
	
	public static HashMap<String, String> jsonStrToMap(String str) {
		TypeToken<HashMap<String, String>> typeToken = new TypeToken<HashMap<String, String>>(){};
		HashMap<String, String> mapData 	=  gson.fromJson(str, typeToken.getType());
		return mapData;
	}
	
	public static ArrayList<HashMap<String, String>> jsonArrToArr(String str) {
		TypeToken<ArrayList<HashMap<String, String>>> typeToken = new TypeToken<ArrayList<HashMap<String, String>>>(){};
		ArrayList<HashMap<String, String>> dataList 	=  gson.fromJson(str, typeToken.getType());
		return dataList;
	}
	
	public static ArrayList<HashMap<String, Object>> jsonStrToArrObj(String str) {
		TypeToken<ArrayList<HashMap<String, Object>>> typeToken = new TypeToken<ArrayList<HashMap<String, Object>>>(){};
		ArrayList<HashMap<String, Object>> dataList 	=  gson.fromJson(str, typeToken.getType());
		return dataList;
	}
	
	public static ArrayList<String> jsonStrToArrStr(String str){
		TypeToken<ArrayList<String>> typeToken = new TypeToken<ArrayList<String>>(){};
		ArrayList<String>  dataList 	=  gson.fromJson(str, typeToken.getType());
		return dataList;		
	}
}
