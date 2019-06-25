package html.app.modal;

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
import app.common.TeamInfo;
import app.eCmm.Cmm0100;
import app.eCmm.Cmm0400;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/TreeOrganization")
public class TreeOrganization extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	TeamInfo teamInfo = new TeamInfo();
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
				case "GET_TREE_INFO" :
					response.getWriter().write( getTreeInfo(jsonElement) );
					break;
				case "getZTreeInfo" :
					response.getWriter().write( getTreeInfo_zTree(jsonElement) );
					break;
				case "insertNewDir" :
					response.getWriter().write( insertNewDir(jsonElement) );
					break;
				case "checkDelDir" :
					response.getWriter().write( checkDelDir(jsonElement) );
					break;
				case "delDir" :
					response.getWriter().write( delDir(jsonElement) );
					break;
				case "reNameDir" :
					response.getWriter().write( reNameDir(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	//
	private String getTreeInfo(JsonElement jsonElement) throws SQLException, Exception {
		String treeInfoData = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "treeInfoData") );
		return gson.toJson( teamInfo.getTeamInfoTree_new(Boolean.parseBoolean(treeInfoData)) );
	}
	
	private String getTreeInfo_zTree(JsonElement jsonElement) throws SQLException, Exception {
		String treeInfoData = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "treeInfoData") );
		return gson.toJson( teamInfo.getTeamInfoTree_zTree(Boolean.parseBoolean(treeInfoData)) );
	}
	
	// [사용자정보 > 조직도 ] 조칙 추가 (동일레벨)
	private String insertNewDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson( cmm0400.subNewDir(dataObj) );
	}
	
	// [사용자정보 > 조직도 ] 조직 삭제전 조직에 등록된 사용자 있는지 체크
	private String checkDelDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson( cmm0400.subDelDir_Check(dataObj) );
	}
	
	// [사용자정보 > 조직도 ] 조직 삭제
	private String delDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson( cmm0400.subDelDir(dataObj) );
	}
	// [사용자정보 > 조직도 ] 조직명 변경
	private String reNameDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson( cmm0400.subRename(dataObj) );
	}
	
	
}
