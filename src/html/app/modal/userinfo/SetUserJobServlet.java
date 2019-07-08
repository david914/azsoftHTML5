package html.app.modal.userinfo;

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

import app.common.SysInfo;
import app.eCmm.Cmm0400;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/userinfo/SetUserJobServlet")
public class SetUserJobServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
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
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getUserList" :
					response.getWriter().write( getUserList(jsonElement) );
					break;
				case "getTeamUserList" :
					response.getWriter().write( getTeamUserList(jsonElement) );
					break;
				case "getJobInfo" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "getUserJobList" :
					response.getWriter().write( getUserJobList(jsonElement) );
					break;
				case "setAllUserJob" :
					response.getWriter().write( setAllUserJob(jsonElement) );
					break;
				case "delUserJob" :
					response.getWriter().write( delUserJob(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	// [사용자정보 > 업무권한일괄등록] 시스템정보가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String ReqCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [사용자정보 > 업무권한일괄등록] 유저리스트 가져오기
	private String getUserList(JsonElement jsonElement) throws SQLException, Exception {
		String selectedIndex= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "selectedIndex") );
		String UserName 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserName") );
		return gson.toJson(cmm0400.getUserList(Integer.parseInt(selectedIndex), UserName));
	}
	
	// [사용자정보 > 업무권한일괄등록] 팀의 유저리스트 가져오기
	private String getTeamUserList(JsonElement jsonElement) throws SQLException, Exception {
		String Cbo_Sign= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Cbo_Sign") );
		return gson.toJson(cmm0400.getTeamUserList(Cbo_Sign));
	}
	
	// [사용자정보 > 업무권한일괄등록] 시스템의 업무 리스트 가져오기
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserID") );
		String SysCd	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SecuYn	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String CloseYn	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String SelMsg	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String sortCd	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "sortCd") );
		return gson.toJson(sysinfo.getJobInfo(UserID, SysCd, SecuYn, CloseYn, SelMsg, sortCd));
	}
	
	// [사용자정보 > 업무권한일괄등록] 사용자의 등록된 업무 리스트 가져오기
	private String getUserJobList(JsonElement jsonElement) throws SQLException, Exception {
		String gbnCd	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		String UserId	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm0400.getUserJobList(gbnCd, UserId));
	}
	
	// [사용자정보 > 업무권한일괄등록] 업무리스트 등록
	private String setAllUserJob(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		ArrayList<HashMap<String, String>> UserList	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "UserList") );
		ArrayList<HashMap<String, String>> JobList	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "JobList") );
		return gson.toJson(cmm0400.setAllUserJob(SysCd, UserList, JobList));
	}
	
	// [사용자정보 > 업무권한일괄등록] 업무리스트 등록
	private String delUserJob(JsonElement jsonElement) throws SQLException, Exception {
		String UserId	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		ArrayList<HashMap<String, String>> JobList	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "JobList") );
		return gson.toJson(cmm0400.delUserJob(UserId, JobList));
	}
}
