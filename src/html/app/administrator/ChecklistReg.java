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

import com.ecams.service.list.LoginManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmm.Cmm0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/ChecklistReg")
public class ChecklistReg extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0100 cmm0100 = new Cmm0100();
	
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
				case "getItemInfoTree" :
					response.getWriter().write( getItemInfoTree(jsonElement) );
					break;
				case "getItemInfoStepList" :
					response.getWriter().write( getInfoStepList(jsonElement) );
					break;
				case "newItemInfo" :
					response.getWriter().write( newItemInfo(jsonElement) );
					break;
				case "updateItemInfo" :
					response.getWriter().write( updateItemInfo(jsonElement) );
					break;
				case "delItemInfo" :
					response.getWriter().write( delItemInfo(jsonElement) );
					break;
				case "updateItemInfoStep" :
					response.getWriter().write( updateItemInfoStep(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getItemInfoTree(JsonElement jsonElement) throws SQLException, Exception {
		String micode = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "code"));
		return gson.toJson(cmm0100.getItemInfoZTree(micode));
	}
	
	private String getInfoStepList(JsonElement jsonElement) throws SQLException, Exception {
		String nodeId = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "nodeid"));
		return gson.toJson(cmm0100.getItemInfoStepList(nodeId));
	}
	
	private String newItemInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj"));
		return gson.toJson(cmm0100.newItemInfo(dataObj));
	}
	
	private String updateItemInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj"));
		return gson.toJson(cmm0100.updateItemInfo(dataObj));
	}
	
	private String delItemInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj"));
		return gson.toJson(cmm0100.delItemInfo(dataObj));
	}
	
	private String updateItemInfoStep(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> dataList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.updateItemInfoStep(dataList));
	}
}
