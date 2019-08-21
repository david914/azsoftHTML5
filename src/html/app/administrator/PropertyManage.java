package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0700;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/PropertyManage")
public class PropertyManage extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0700 cmm0700 = new Cmm0700();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}
	
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JsonParser jsonParser = new JsonParser();
		JsonElement jsonElement = jsonParser.parse(ParsingCommon.getJsonStr(request));
		String requestType	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "requestType") );
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "getSvrProperties" :
					response.getWriter().write( getSvrProperties(jsonElement) );
					break;
				case "getProperties" :
					response.getWriter().write( getProperties(jsonElement) );
					break;
				case "saveProperties" :
					response.getWriter().write( saveProperties(jsonElement) );
					break;
				case "saveSvrProperties" :
					response.getWriter().write( saveSvrProperties(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [프로퍼티관리] 서버 프로퍼티가져오기
	private String getSvrProperties(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getSvrProperties());
	}
	// [프로퍼티관리] WEB 프로퍼티 가져오기
	private String getProperties(JsonElement jsonElement) throws SQLException, Exception {
		String strGbn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strGbn"));
		return gson.toJson(cmm0700.getProperties(strGbn));
	}
	// [프로퍼티관리] WEB 프로퍼티 저장
	private String saveProperties(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> infoList  = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"infoList"));
		return gson.toJson(cmm0700.setProperties(infoList));
	}
	// [프로퍼티관리] 서버 프로퍼티 저장
	private String saveSvrProperties(JsonElement jsonElement) throws SQLException, Exception {
		String dbconn 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dbconn"));
		String dbuser 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dbuser"));
		String dbpass 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"dbpass"));
		return gson.toJson(cmm0700.setSvrProperties(dbconn, dbuser, dbpass));
	}
}
