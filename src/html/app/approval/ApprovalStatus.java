package html.app.approval;

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
import app.common.TeamInfo;
import app.common.UserInfo;
import app.eCmr.Cmr3100;
import html.app.common.ParsingCommon;


@WebServlet("/webPage/approval/ApprovalStatus")
public class ApprovalStatus extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	SysInfo sysinfo = new SysInfo();
	CodeInfo codeinfo = new CodeInfo();
	TeamInfo teaminfo = new TeamInfo();
	Cmr3100 cmr3100 = new Cmr3100();
	 
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
				case "UserInfochk" :
					response.getWriter().write( getUserInfo(jsonElement) );
					break;
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getTeamInfo" :
					response.getWriter().write( getTeamInfo(jsonElement) );
					break;	
				case "getSelectList" :
					response.getWriter().write( getSelectList(jsonElement) );
					break;	
				case "getTest" :
					response.getWriter().write( getTest(jsonElement) );
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
	
	private int getTest(JsonElement jsonElement) throws SQLException, Exception {
		return 0;
	}
	
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String user = null;
		user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.getUserInfo(user));
	}
	// [결재현황] 시스템 정보 가져오기
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String ReqCd  = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	// [결재현황] 부서 정보 가져오기
	private String getTeamInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String cm_useyn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cm_useyn") );
		String gubun 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gubun") );
		String itYn		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "itYn") );
		return gson.toJson(teaminfo.getTeamInfoGrid2(SelMsg, cm_useyn, gubun, itYn));
	}
	
	// [결재현황] 결재현황 리스트 가져오기
	private String getSelectList(JsonElement jsonElement) throws SQLException, Exception {
		String syscd		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "syscd") );
		String gbn			= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbn") );
		String pReqCd		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pReqCd") );
		String pTeamCd		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pTeamCd") );
		String pStateCd		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pStateCd") );
		String pReqUser		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pReqUser") );
		String pStartDt		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pStartDt") );
		String pEndDt		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pEndDt") );
		String pUserId		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pUserId") );
		String dategbn		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "dategbn") );
		String txtspms		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "txtspms") );
		String pProc		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pProc") );
		return gson.toJson( cmr3100.get_SelectList(syscd, gbn, pReqCd, pTeamCd, pStateCd, 
													pReqUser, pStartDt, pEndDt, pUserId, dategbn, txtspms, pProc) );
	}
}
