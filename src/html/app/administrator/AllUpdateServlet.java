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

import app.common.UserInfo;
import app.eCmd.Cmd0100;
import app.eCmd.Cmd0500;
import app.eCmm.Cmm1200;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/AllUpdateServlet")
public class AllUpdateServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userInfo = new UserInfo();
	Cmd0100  cmd0100  = new Cmd0100();
	Cmd0500  cmd0500  = new Cmd0500();
	Cmm1200  cmm1200  = new Cmm1200();
	
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
				case "GETOWNERLIST" :
					response.getWriter().write( getOwnerList(jsonElement) );
					break;
				case "GETDIRLIST" :
					response.getWriter().write( getDirList(jsonElement) );
					break;
				case "GETPRGLIST" :
					response.getWriter().write( getPrgList(jsonElement) );
					break;
				case "UPDATEPROGINFO" :
					response.getWriter().write( updateProgInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	//[일괄업데이트]담당자조회
	private String getOwnerList(JsonElement jsonElement) throws SQLException, Exception {
		String syscd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"syscd"));
		return gson.toJson(userInfo.getUserInfo_job(syscd));
	}
	
	//[일괄업데이트]경로조회
	private String getDirList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.getDir(DataMap.get("userId"),
										  DataMap.get("sysCd"),
										  DataMap.get("secuYn"),
										  DataMap.get("rsrccd"),
										  DataMap.get("jobcd"),
										  DataMap.get("selMsg")));
	}
	
	//[일괄업데이트]프로그램조회
	private String getPrgList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getSql_Qry(DataMap));
	}
	
	//[일괄업데이트]프로그램정보 일괄수정
	private String updateProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		ArrayList<HashMap<String, String>> ProgList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "ProgList") );
		return gson.toJson(cmd0500.updateProgInfo(DataMap, ProgList));
	}
}
