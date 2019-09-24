package html.app.approval;

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

import app.common.CodeInfo;
import app.common.SysInfo;
import app.common.TeamInfo;
import app.common.UserInfo;
import app.eCmr.Cmr0150;
import app.eCmr.Cmr3100;
import app.eCmr.Cmr3200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/approval/RequestStatus")
public class RequestStatus extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	SysInfo sysinfo = new SysInfo();
	CodeInfo codeinfo = new CodeInfo();
	TeamInfo teaminfo = new TeamInfo();
	Cmr3200 cmr3200 = new Cmr3200();
	Cmr3100 cmr3100 = new Cmr3100();
	Cmr0150 cmr0150 = new Cmr0150();
	
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
				case "UserPMOInfo" :
					response.getWriter().write( getPMOInfo(jsonElement) );
					break;
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getDeptInfo" :
					response.getWriter().write( getDeptInfo(jsonElement) );
					break;
				case "getRquestList" :
					response.getWriter().write( getRquestList(jsonElement) );
					break;
				case "getCodeInfo" :
					response.getWriter().write( getCodeInfo() );
					break;
				case "nextConf" :
					response.getWriter().write( nextConf(jsonElement) );
					break;
				case "svrProc" :
					response.getWriter().write( svrProc(jsonElement) );
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
	
	private String getUserInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserID = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.getUserInfo(UserID));
	}
	
	private String getCodeInfo() throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("REQUEST", "all", "n"));
	}
	
	private String getPMOInfo(JsonElement jsonElement) throws SQLException, Exception {
		String user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.getPMOInfo(user));
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String user = null;
		user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(sysinfo.getSysInfo(user,"Y","ALL","N",""));
	}
	
	
	private String getDeptInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String cm_useyn = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cm_useyn") );
		String gubun 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gubun") );
		String itYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "itYn") );
		return gson.toJson(teaminfo.getTeamInfoGrid2(SelMsg, cm_useyn, gubun, itYn));
	}
	
	private String getRquestList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	prjDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "prjData") );
		return gson.toJson( cmr3200.get_SelectList(prjDataInfoMap.get("strSys"),
												   prjDataInfoMap.get("strQry"),prjDataInfoMap.get("strTeam"),
												   prjDataInfoMap.get("strSta"),prjDataInfoMap.get("txtUser"),	prjDataInfoMap.get("strStD"),
												   prjDataInfoMap.get("strEdD"),prjDataInfoMap.get("strUserId"),prjDataInfoMap.get("cboGbn"),
												   prjDataInfoMap.get("strJob"),prjDataInfoMap.get("dategbn"),	prjDataInfoMap.get("txtSpms")) );
	}
	
	private String nextConf(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = null;
		AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String UserId = null;
		UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String conMsg = null;
		conMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "conMsg") );
		String Cd = null;
		Cd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "Cd") );
		String ReqCd = null;
		ReqCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		
		try {
			return gson.toJson( cmr3100.nextConf(AcptNo, UserId, conMsg, Cd, ReqCd));
		} catch (SQLException e) {
			return gson.toJson( e.getMessage() );
		} catch (Exception e) {
			return gson.toJson( e.getMessage() );
		}
	}
	
	private String svrProc(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = null;
		AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String prcCd = null;
		prcCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "prcCd") );
		String prcSys = null;
		prcSys = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "prcSys") );
		return gson.toJson( cmr0150.svrProc(AcptNo, prcCd, prcSys));
	}
}
