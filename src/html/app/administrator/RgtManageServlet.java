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

import app.eCmm.Cmm0500;
import app.eCmm.Cmm0600;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/RgtManageServlet")
public class RgtManageServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm0500 cmm0500 = new Cmm0500();
	Cmm0600 cmm0600 = new Cmm0600();
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
				case "getMenuTree" :
					response.getWriter().write(getMenuTree(jsonElement));
					break;
				case "getRgtMenuList" :
					response.getWriter().write(getRgtMenuList(jsonElement));
					break;
				case "setRgtMenuList" :
					response.getWriter().write(setRgtMenuList(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [권한관리] 메뉴 트리 정보 가져오기
	private String getMenuTree(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0500.getMenuZTree());
	}
	
	// [권한관리] 메뉴 트리 정보 가져오기
	private String getRgtMenuList(JsonElement jsonElement) throws SQLException, Exception {
		String rgtcd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"rgtcd"));
		return gson.toJson(cmm0600.getRgtMenuList(rgtcd));
	}
	
	// [권한관리] 메뉴 트리 정보 가져오기
	private String setRgtMenuList(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> Lst_Duty = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"Lst_Duty"));
		ArrayList<HashMap<String, String>> treeMenu = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"treeMenu"));
		return gson.toJson(cmm0600.setRgtMenuList(Lst_Duty, treeMenu));
	}
}
