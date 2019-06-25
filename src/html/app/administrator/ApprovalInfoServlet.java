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

import app.common.SysInfo;
import app.common.TeamInfo;
import app.eCmm.Cmm0200_Copy;
import app.eCmm.Cmm0300;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/ApprovalInfoServlet")
public class ApprovalInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson 		 gson 		  = new Gson();
	SysInfo      sysinfo 	  = new SysInfo();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	TeamInfo	 teamInfo 	  = new TeamInfo();
	Cmm0300 	 cmm0300	  = new Cmm0300();
	
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
				case "GETSYSINFO_RPT" :
					response.getWriter().write( getSysInfo_Rpt(jsonElement) );
					break;
				case "GETPROGINFO" :
					response.getWriter().write( getProgInfo(jsonElement) );
					break;
				case "GETTEAMINFOTREE" : 
					response.getWriter().write( getTeamInfoTree(jsonElement) );
					break;
				case "GETAPPROVALINFO" : 
					response.getWriter().write( getApprovalInfo(jsonElement) );
					break;
				case "SETAPPROVALINFO" :
					response.getWriter().write( setApprovalInfo(jsonElement) );
					break;
				case "DELAPPROVALINFO" :
					response.getWriter().write( delApprovalInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	private String getSysInfo_Rpt(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(sysinfo.getSysInfo_Rpt(DataMap.get("userId"),
											  DataMap.get("selMsg"),
											  DataMap.get("closeYn"),
											  DataMap.get("sysCd")));
	}
	
	private String getProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		String sysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "sysCd"));
		return gson.toJson(cmm0200_copy.getProgInfo(sysCd));
	}
	
	private String getTeamInfoTree(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(teamInfo.getTeamInfoTree_zTree(false));
	}
	
	private String getApprovalInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300.getConfInfo_List(DataMap.get("SysCd"),
											  		DataMap.get("ReqCd"),
											  		DataMap.get("ManId"),
											  		DataMap.get("SeqNo")));
	}
	
	private String setApprovalInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300.confInfo_Updt(DataMap));
	}
	
	private String delApprovalInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300.confInfo_Close(DataMap.get("sysCd"),
 												  DataMap.get("reqCd"),
												  DataMap.get("memId"),
												  DataMap.get("seqNo")));
	}
}
