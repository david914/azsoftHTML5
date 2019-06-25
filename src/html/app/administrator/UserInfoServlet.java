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

import app.common.CodeInfo;
import app.common.SysInfo;
import app.eCmm.Cmm0400;
import app.eCmm.Cmm1700;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/UserInfoServlet")
public class UserInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	CodeInfo codeinfo = new CodeInfo();
	SysInfo sysinfo = new SysInfo();
	Cmm0400 cmm0400 = new Cmm0400();
	Cmm1700 cmm1700 = new Cmm1700();
	
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
				case "getSysInfo" :
				response.getWriter().write( getSysInfo(jsonElement) );
				break;
				case "getJobInfo" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "getUserInfo" :
					response.getWriter().write( getUserInfo(jsonElement) );
					break;
				case "getUserRgtCd" :
					response.getWriter().write( getUserRgtCd(jsonElement) );
					break;
				case "getUserJobList" :
					response.getWriter().write( getUserJobList(jsonElement) );
					break;
				case "getUserRgtDept" :
					response.getWriter().write( getUserRgtDept(jsonElement) );
					break;
				case "deleteJob" :
					response.getWriter().write( deleteJob(jsonElement) );
					break;
				case "deleteUser" :
					response.getWriter().write( deleteUser(jsonElement) );
					break;
				case "setUserInfo" :
					response.getWriter().write( setUserInfo(jsonElement) );
					break;
				case "resetPassWord" :
					response.getWriter().write( resetPassWord(jsonElement) );
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}

	// [사용자정보] 시스템정보가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String ReqCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [사용자정보] 업무정보가져오기
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserID") );
		String SysCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String sortCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "sortCd") );
		return gson.toJson(sysinfo.getJobInfo(UserID, SysCd, SecuYn, CloseYn, SelMsg, sortCd));
	}
	
	// [사용자정보] 사용자 권한가져오기
	private String getUserRgtCd(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserRGTCD(UserId));
	}
	// [사용자정보] 사용자 업무 리스트 가져오기
	private String getUserJobList(JsonElement jsonElement) throws SQLException, Exception {
		String gbnCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserJobList(gbnCd, UserId));
	}
	// [사용자정보] 
	private String getUserRgtDept(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserRgtDept(UserId));
	}
	// [사용자정보] 사용자정보가져오기
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String userId  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		String userName = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userName") );
		return gson.toJson(cmm0400.getUserInfo(userId,userName));
	}
	// [사용자정보] 담당업무 삭제
	private String deleteJob(JsonElement jsonElement) throws SQLException, Exception {
		String UserId  								= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		ArrayList<HashMap<String, String>> JobList 	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "JobList") );
		return gson.toJson(cmm0400.delUserJob(UserId, JobList));
	}
	// [사용자정보] 사용자정보 폐끼
	private String deleteUser(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.delUserInfo(UserId));
	}
	// [사용자정보] 사용자정보 폐끼
	private String setUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj 			= ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		ArrayList<HashMap<String, String>> DutyList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "DutyList") );
		ArrayList<HashMap<String, String>> JobList	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "JobList") );
		return gson.toJson(cmm0400.setUserInfo(dataObj, DutyList, JobList));
	}
	
	// [사용자정보 > 비밀번호초기화] 비밀번호 초기화
	private String resetPassWord(JsonElement jsonElement) throws SQLException, Exception {
		String user_id  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "user_id") );
		String JuMinNUM = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "JuMinNUM") );
		return gson.toJson(cmm1700.PassWd_reset(user_id, JuMinNUM));
	}
}
