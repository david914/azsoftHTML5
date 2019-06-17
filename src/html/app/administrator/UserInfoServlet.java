package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
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
					
					
					
					
				case "Cmm0400_1" :
					response.getWriter().write( getListDuty(jsonElement) );
					break;
				case "Cmm0400_2" :
					response.getWriter().write( getjobList(jsonElement) );
					break;
				case "Cmm0400_3" :
					response.getWriter().write( getUserRgtDept(jsonElement) );
					break;
				default:
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
	
	
	
	
	
	private String getListDuty(JsonElement jsonElement) throws SQLException, Exception {
		String txtUserId = null;
		txtUserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "txtUserId") );
		return gson.toJson(cmm0400.getUserRGTCD(txtUserId));
	}
	
	private String getjobList(JsonElement jsonElement) throws SQLException, Exception {
		String txtUserId = null;
		txtUserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "txtUserId") );
		return gson.toJson(cmm0400.getUserJobList("USER", txtUserId));
	}
	
}
