package html.app.dev;

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

import app.common.PrjInfo;
import app.common.SysInfo;
import app.eCmd.Cmd0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/dev/ProgRegisterServlet")
public class ProgRegisterServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd0100 cmd0100  = new Cmd0100();
	PrjInfo prjinfo  = new PrjInfo();
	SysInfo sysinfo  = new SysInfo();
	
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
				case "GETSRID" :
					response.getWriter().write( getSrId(jsonElement) );
					break;
				case "GETSYSINFO" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "GETJOBINFO" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "GETJAWON" :
					response.getWriter().write( getJawon(jsonElement) );
					break;
				case "GETDIR" :
					response.getWriter().write( getDir(jsonElement) );
					break;
				case "GETPROGLIST" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				case "DELETEPROG" :
					response.getWriter().write( deleteProg(jsonElement) );
					break;
				case "CHECKPROG" :
					response.getWriter().write( checkProg(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getSrId(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(prjinfo.getPrjList(DataMap));
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getSysInfo(DataMap.get("userId"),
											  DataMap.get("secuYn"),
											  DataMap.get("selMsg"),
											  DataMap.get("closeYn"), 
											  DataMap.get("reqCd")));
	}
	
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getJobInfo(DataMap.get("userId"),
											  DataMap.get("sysCd"),
											  DataMap.get("secuYn"),
											  DataMap.get("closeYn"), 
											  DataMap.get("selMsg"),
											  DataMap.get("sortCd")));
	}
		
	private String getJawon(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.getRsrcOpen(DataMap.get("sysCd"),
											   DataMap.get("selMsg")));
	}

	private String getDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.getDir(DataMap.get("userId"),
										  DataMap.get("sysCd"),
										  DataMap.get("secuYn"),
										  DataMap.get("rsrccd"),
										  DataMap.get("jobcd"),
										  DataMap.get("selMsg")));
	}

	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.getOpenList(DataMap.get("SRID"),
											   DataMap.get("userId"),
											   DataMap.get("sysCd"),
											   DataMap.get("rsrccd"),
											   DataMap.get("rsrcname"),
											   Boolean.valueOf(DataMap.get("secuSw"))));
	}
	
	private String deleteProg(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		ArrayList<HashMap<String, String>> ProgList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "ProgList") );
		return gson.toJson(cmd0100.cmr0020_Delete(UserId, ProgList));
	}
	
	private String checkProg(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0100.pgmCheck(DataMap));
	}
}
