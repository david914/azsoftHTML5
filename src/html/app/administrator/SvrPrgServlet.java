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

import app.common.CodeInfo;
import app.common.SysInfo;
import app.eCmm.Cmm0200;
import app.eCmm.Cmm0200_Copy;
import app.eCmm.Cmm0200_Item;
import app.eCmm.Cmm0200_Svr;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/SvrPrgServlet")
public class SvrPrgServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	Gson gson = new Gson();
	Cmm0200_Item cmm0200_item = new Cmm0200_Item();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	
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
				case "getSvrList" :
					response.getWriter().write(getSvrList(jsonElement));
					break;
				case "getSvrItemGrid" :
					response.getWriter().write(getSvrItemGrid(jsonElement));
					break;
				case "getUlItemInfo" :
					response.getWriter().write(getUlItemInfo(jsonElement));
					break;
				case "getItemList" :
					response.getWriter().write(getItemList(jsonElement));
					break;
				case "insertItem" :
					response.getWriter().write(insertItem(jsonElement));
					break;
				case "closeItem" :
					response.getWriter().write(closeItem(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보]  서버정보 콤보 가져오기
	private String getSvrList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_item.getSvrList(SysCd));
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보] 서버정보 그리드 가져오기
	private String getSvrItemGrid(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SvrCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SvrCd") );
		return gson.toJson(cmm0200_copy.getSvrInfo(SysCd, SvrCd));
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보] 프로그램종류 가져오기
	private String getUlItemInfo(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_copy.getProgInfo(SysCd));
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보] 프로그램종류 가져오기
	private String getItemList(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		return gson.toJson(cmm0200_item.getItemList(SysCd));
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보] 프로그램종류 가져오기
	private String insertItem(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(cmm0200_item.itemInfo_Ins(etcData));
	}
	
	// [시스템상세정보 > 서버별 프로그램종류 연결정보] 프로그램종류 가져오기
	private String closeItem(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(cmm0200_item.itemInfo_Close(etcData));
	}
	
}
