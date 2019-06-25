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

import app.eCmm.Cmm0400;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/JobCopyServlet")
public class JobCopyServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0400 cmm0400 = new Cmm0400();
	
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
				case "getAllUser" :
					response.getWriter().write( getAllUser(jsonElement) );
					break;
				case "getUserRgtCd" :
					response.getWriter().write( getUserRgtCd(jsonElement) );
					break;
				case "getUserJobList" :
					response.getWriter().write( getUserJobList(jsonElement) );
					break;
				case "copyJob" :
					response.getWriter().write( copyJob(jsonElement) );
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}

	// [사용자정보 > 사용자권한복사] 모든 사용자 가져오기
	private String getAllUser(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0400.getAllUser());
	}
	
	// [사용자정보 > 사용자권한복사] 사용자 권한 가져오기
	private String getUserRgtCd(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserRGTCD(UserId));
	}
	
	// [사용자정보 > 사용자권한복사] 사용자 업무 가져오기
	private String getUserJobList(JsonElement jsonElement) throws SQLException, Exception {
		String gbnCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserJobList(gbnCd, UserId));
	}
	
	// [사용자정보 > 사용자권한복사] 사용자 업무 가져오기
	private String copyJob(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData 	= ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		ArrayList<HashMap<String, String>> JobList 	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "JobList") );
		ArrayList<HashMap<String, String>> RgtList 	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "RgtList") );
		return gson.toJson(cmm0400.userCopy(etcData, JobList, RgtList));
	}
}
