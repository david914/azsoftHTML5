package html.app.program;

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
import app.eCmd.Cmd0500;
import app.common.PrjInfo;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/program/ProgramInfoServlet")
public class ProgramInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmd0500 cmd0500  = new Cmd0500();
	PrjInfo prjinfo  = new PrjInfo();
	
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
				case "GETSYSINFO" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "GETJOBINFO" :
					response.getWriter().write( getJobInfo(jsonElement) );
					break;
				case "GETRSRCINFO" :
					response.getWriter().write( getRsrcInfo(jsonElement) );
					break;
				case "GETPROGLIST" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				case "GETPROGINFO" :
					response.getWriter().write( getProgInfo(jsonElement) );
					break;
				case "GETHISTORY" :
					response.getWriter().write( getProgHistory(jsonElement) );
					break;
				case "GETSRID" :
					response.getWriter().write( getSRID(jsonElement) );
					break;
				case "GETDIRLIST" :
					response.getWriter().write( getDirList(jsonElement) );
					break;
				case "GETEDITORLIST" :
					response.getWriter().write( getEditorList(jsonElement) );
					break;
				case "DELETEPROG" :
					response.getWriter().write( deleteProg(jsonElement) );
					break;
				case "CLOSEPROG" :
					response.getWriter().write( closeProg(jsonElement) );
					break;
				case "UPDATEPROG" :
					response.getWriter().write( updateProg(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getSysInfo_Rpt(DataMap));
	}
	
	private String getJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getJobInfo_Rpt(DataMap));
	}
	
	private String getRsrcInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getRsrcInfo_Rpt(DataMap));
	}
	
	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getSql_Qry(DataMap));
	}

	private String getProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.Cmd0500_Lv_File_ItemClick(DataMap));
	}

	private String getProgHistory(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getSql_Qry_Hist(DataMap));
	}

	private String getSRID(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(prjinfo.getPrjList(DataMap));
	}
	
	private String getDirList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getDir_Check(DataMap.get("userId"),
										        DataMap.get("secuYn"),
											    DataMap.get("sysCd"), 
											    DataMap.get("itemId"), 
											    DataMap.get("rsrcCd"),
											    DataMap.get("dsnCd"),
											    DataMap.get("findFg")));
	}
	
	private String getEditorList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getCbo_Editor_Add(DataMap.get("itemId"),
										             DataMap.get("editor")));
	}
	private String deleteProg(JsonElement jsonElement) throws SQLException, Exception {
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "itemId") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		return gson.toJson(cmd0500.getItem_Delete(UserId,ItemId));
	}
	private String closeProg(JsonElement jsonElement) throws SQLException, Exception {
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "itemId") );
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		return gson.toJson(cmd0500.getTbl_Delete(UserId,ItemId));
	}
	private String updateProg(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmd0500.getTbl_Update(DataMap));
	}
}
