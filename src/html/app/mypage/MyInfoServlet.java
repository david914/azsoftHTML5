package html.app.mypage;

import java.io.IOException;
import java.sql.SQLException;

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

@WebServlet("/webPage/mypage/MyInfoServlet")
public class MyInfoServlet extends HttpServlet {
	
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
				case "getUserInfo" :
					response.getWriter().write( getUserInfo(jsonElement) );
					break;
				case "getUserRgtCd" :
					response.getWriter().write( getUserRgtCd(jsonElement) );
					break;
				case "getUserJobList" :
					response.getWriter().write( getUserJobList(jsonElement) );
					break;
				case "getDevProgramList" :
					response.getWriter().write( getDevProgramList(jsonElement) );
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
	}
	

	// [기본정보] 사용자정보가져오기
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String userId  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		String userName = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userName") );
		return gson.toJson(cmm0400.getUserInfo(userId,userName));
	}
	
	// [기본정보] 사용자 권한가져오기
	private String getUserRgtCd(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserRGTCD(UserId));
	}
	
	// [기본정보] 사용자 업무 리스트 가져오기
	private String getUserJobList(JsonElement jsonElement) throws SQLException, Exception {
		String gbnCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserJobList(gbnCd, UserId));
	}

	// [기본정보] 사용자 업무 리스트 가져오기
	private String getDevProgramList(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getDevProgramList(UserId));
	}
}
