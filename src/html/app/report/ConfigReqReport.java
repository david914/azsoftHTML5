package html.app.report;

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
import app.eCmp.Cmp0600;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/ConfigReqReport")
public class ConfigReqReport extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	SysInfo sysinfo = new SysInfo();
	CodeInfo codeinfo = new CodeInfo();
	TeamInfo teaminfo = new TeamInfo();
	Cmp0600 cmp0600 = new Cmp0600();
	
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
				case "getDeptInfo" :
					response.getWriter().write( getDeptInfo(jsonElement) );
					break;
				case "getSelectList" :
					response.getWriter().write( getSelectList(jsonElement) );
					break;
				case "getCodeInfo" :
					response.getWriter().write( getCodeInfo(jsonElement) );
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String user = null;
		user = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(sysinfo.getSysInfo(user,"Y","ALL","N",""));
	}
	
	
	private String getDeptInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(teaminfo.getTeamInfoGrid2("All", "Y", "sub", "N"));
	}
	
	private String getSelectList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	prjDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "prjData") );
		System.out.println(prjDataInfoMap.get("stDt")+" / "+
				   prjDataInfoMap.get("edDt")+" / "+prjDataInfoMap.get("desc")+" / "+
				   prjDataInfoMap.get("strSys")+" / "+prjDataInfoMap.get("strJob")+" / "+	prjDataInfoMap.get("strDept")+" / "+
				   prjDataInfoMap.get("txtUser")+" / "+prjDataInfoMap.get("strQry")+" / "+prjDataInfoMap.get("strGbn")+" / "+
				   prjDataInfoMap.get("strPrc")+" / "+prjDataInfoMap.get("srId")+" / "+	prjDataInfoMap.get("dategbn"));
		return gson.toJson( cmp0600.get_SelectList(prjDataInfoMap.get("stDt"),
												   prjDataInfoMap.get("edDt"),prjDataInfoMap.get("desc"),
												   prjDataInfoMap.get("strSys"),prjDataInfoMap.get("strJob"),	prjDataInfoMap.get("strDept"),
												   prjDataInfoMap.get("txtUser"),prjDataInfoMap.get("strQry"),prjDataInfoMap.get("strGbn"),
												   prjDataInfoMap.get("strPrc"),prjDataInfoMap.get("srId"),	prjDataInfoMap.get("dategbn")) );
	}
	
	private String getCodeInfo(JsonElement jsonElement) throws SQLException, Exception {
		String code = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "cm_macode"));
		return gson.toJson(codeinfo.getCodeInfo(code,"ALL","N"));
	}
}
