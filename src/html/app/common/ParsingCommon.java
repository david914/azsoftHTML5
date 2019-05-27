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
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

public class ParsingCommon {
	
	public static Gson gson = new Gson();
	
	
	public static HashMap jsonStrToMap(HttpServletRequest req) {
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
		String null_ck = json.toString().replaceAll("\"\"", "null");
		json = new StringBuffer(null_ck);
		System.out.println("jsonStr : " + json.toString());
		TypeToken<HashMap> typeToken = new TypeToken<HashMap>(){};
		HashMap mapData 	=  gson.fromJson(json.toString(), typeToken.getType());
		System.out.println("jsonStrTomap : " + mapData.toString());
		return mapData;
	}
	
	public static HashMap reqParamToMap(HttpServletRequest req) {
		return jsonStrToMap(req);
	}

	/*
	 * request json string�� String ���·� ��ȯ�մϴ�.
	 */
	public static String parsingRequestJsonParamToString(HttpServletRequest req, String dataTypeParam) {
		String jsonData = null;
		String returnString = null;
		jsonData 		= req.getParameter(dataTypeParam);
		returnString 	= (String) gson.fromJson(jsonData, String.class);
		return null;
	}
	
	
	/*
	 * json string�� HasMap<String,String> ���·� ��ȯ�մϴ�.
	 */
	public static HashMap<String, String> parsingRequestJsonParamToHashMap(String str) {
		String jsonData = null;
		jsonData 	=str;
		System.out.println("jsonData = "+jsonData);
		TypeToken<HashMap<String, String>> typeToken = new TypeToken<HashMap<String, String>>(){};
		HashMap<String, String> mapData 	=  gson.fromJson(jsonData, typeToken.getType());
		return mapData;
	}
	
	/*
	 * request json string�� HasMap<String,String> ���·� ��ȯ�մϴ�.
	 */
	public static HashMap<String, String> parsingRequestJsonParamToHashMap(HttpServletRequest req, String paramKey) {
		String jsonData = null;
		jsonData 	= req.getParameter(paramKey);
		TypeToken<HashMap<String, String>> typeToken = new TypeToken<HashMap<String, String>>(){};
		HashMap<String, String> mapData 	=  gson.fromJson(jsonData, typeToken.getType());
		return mapData;
	}
	
	/*
	 * json string�� ArrayList<HashMap<String, String>> ���·� ��ȯ�մϴ�.
	 */
	public static ArrayList<HashMap<String, String>> parsingRequestJsonParamToArrayList(String str) {
		String jsonData = null;
		jsonData 	= str;
		TypeToken<ArrayList<HashMap<String, String>>> typeToken = new TypeToken<ArrayList<HashMap<String, String>>>(){};
		ArrayList<HashMap<String, String>> dataList 	=  gson.fromJson(jsonData, typeToken.getType());
		return dataList;
	}
	
	
	/*
	 * request json string�� ArrayList<HashMap<String, String>> ���·� ��ȯ�մϴ�.
	 */
	public static ArrayList<HashMap<String, String>> parsingRequestJsonParamToArrayList(HttpServletRequest req, String paramKey) {
		String jsonData = null;
		jsonData 	= req.getParameter(paramKey);
		TypeToken<ArrayList<HashMap<String, String>>> typeToken = new TypeToken<ArrayList<HashMap<String, String>>>(){};
		ArrayList<HashMap<String, String>> dataList 	=  gson.fromJson(jsonData, typeToken.getType());
		return dataList;
	}
	
	/*
	 * json string�� ArrayList<HashMap<String, Object>> ���·� ��ȯ�մϴ�.
	 */
	public static ArrayList<HashMap<String, Object>> parsingRequestJsonParamToArrayListHashMapObject(String str) {
		String jsonData = null;
		jsonData 	= str;
		TypeToken<ArrayList<HashMap<String, Object>>> typeToken = new TypeToken<ArrayList<HashMap<String, Object>>>(){};
		ArrayList<HashMap<String, Object>> dataList 	=  gson.fromJson(jsonData, typeToken.getType());
		return dataList;
	}
	
	/*
	 * request json string�� ArrayList<HashMap<String, Object>> ���·� ��ȯ�մϴ�.
	 */
	public static ArrayList<HashMap<String, Object>> parsingRequestJsonParamToArrayListHashMapObject(HttpServletRequest req, String paramKey) {
		String jsonData = null;
		jsonData 	= req.getParameter(paramKey);
		TypeToken<ArrayList<HashMap<String, Object>>> typeToken = new TypeToken<ArrayList<HashMap<String, Object>>>(){};
		ArrayList<HashMap<String, Object>> dataList 	=  gson.fromJson(jsonData, typeToken.getType());
		return dataList;
	}
	
	/*
	 * request json string�� ArrayList<HashMap<String, Object>> ���·� ��ȯ�մϴ�.
	 * �� �Ķ���ʹ� String���ڿ��� �޾ƿɴϴ�.
	 */
	public static ArrayList<HashMap<String, Object>> parsingJsonToArrayListHashMapObject( String jsonStr ) {
		TypeToken<ArrayList<HashMap<String, Object>>> typeToken = new TypeToken<ArrayList<HashMap<String, Object>>>(){};
		ArrayList<HashMap<String, Object>> dataList 	=  gson.fromJson(jsonStr, typeToken.getType());
		return dataList;
	}

}
