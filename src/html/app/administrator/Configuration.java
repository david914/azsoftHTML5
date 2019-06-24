package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0700;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/Configuration")
public class Configuration extends HttpServlet {
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
				case "getAgentInfo" :
					response.getWriter().write( getAgentInfo(jsonElement) );
					break;
				case "setAgentInfo" :
					response.getWriter().write( setAgentInfo(jsonElement) );
					break;
				case "getOperTimeList" :
					response.getWriter().write( getOperTimeList(jsonElement) );
					break;
				case "deleteOperList" :
					response.getWriter().write( deleteOperList(jsonElement) );
					break;
				case "insertOperTime" :
					response.getWriter().write( insertOperTime(jsonElement) );
					break;
				case "getDelCycleList" :
					response.getWriter().write( getDelCycleList(jsonElement) );
					break;
				case "deleteDelCycle" :
					response.getWriter().write( deleteDelCycle(jsonElement) );
					break;
				case "insertDelCycle" :
					response.getWriter().write( insertDelCycle(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [환경설정] 환경설정 기본정보 가져오기
	private String getAgentInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getAgentInfo());
	}
	
	// [환경설정] 환경설정 기본정보 가져오기
	private String setAgentInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> objData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "objData") );
		return gson.toJson(cmm0700.setAgentInfo(objData));
	}
	
	
	// [환경설정 > 운영시간관리] 운영시간관리 리스트 가져오기
	private String getOperTimeList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab1Info());
	}
	
	// [환경설정 > 운영시간관리] 운영시간관리 리스트 삭제
	private String deleteOperList(JsonElement jsonElement) throws SQLException, Exception {
		String timegb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "timegb") );
		return gson.toJson(cmm0700.delTab1Info(timegb));
	}
	// [환경설정 > 운영시간관리] 운영시간관리 리스트 등록
	private String insertOperTime(JsonElement jsonElement) throws SQLException, Exception {
		String timegb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "timegb") );
		String stTime = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "stTime") );
		String edTime = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "edTime") );
		return gson.toJson(cmm0700.addTab1Info(timegb, stTime, edTime));
	}
	
	
	// [환경설정 > 삭제시간관리] 삭제시간관리 리스트 가져오기
	private String getDelCycleList(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0700.getTab2Info());
	}
	// [환경설정 > 삭제시간관리] 삭제시간관리 리스트 가져오기
	private String deleteDelCycle(JsonElement jsonElement) throws SQLException, Exception {
		String delgb = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "delgb") );
		return gson.toJson(cmm0700.delTab2Info(delgb));
	}
	// [환경설정 > 삭제시간관리] 삭제시간관리 리스트 가져오기
	private String insertDelCycle(JsonElement jsonElement) throws SQLException, Exception {
		String delgb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "delgb") );
		String deljugi 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "deljugi") );
		String jugigb 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "jugigb") );
		return gson.toJson(cmm0700.addTab2Info(delgb, deljugi, jugigb));
	}
}
