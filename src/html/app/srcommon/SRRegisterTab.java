/**
 * SRRegitser 화면 서블릿
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-08-05
 */

package html.app.srcommon;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.*;

import app.common.CodeInfo;
import app.common.PrjInfo;
import app.common.TeamInfo;
import app.eCmc.Cmc0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/srcommon/SRRegisterTab")
public class SRRegisterTab extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmc0100 cmc0100 = new Cmc0100();
	
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
				case "GET_USER_COMBO" :
					response.getWriter().write( getUserCombo(jsonElement) );
					break;
				case "selectSRInfo" :
					response.getWriter().write( selectSRInfo(jsonElement) );
					break;
				case "getDocList" :
					response.getWriter().write( getDocList(jsonElement) );
					break;
				case "getDevUserList" :
					response.getWriter().write( getDevUserList(jsonElement) );
					break;
				case "insertSRInfo" :
					response.getWriter().write( insertSRInfo(jsonElement) );
					break;
				case "updateSRInfo" :
					response.getWriter().write( updateSRInfo(jsonElement) );
					break;	
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getUserCombo(JsonElement jsonElement) throws SQLException, Exception {
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userInfoData") );
		return gson.toJson(cmc0100.getUserCombo("REQUSER", "", "", userId));
	}
	
	private String selectSRInfo(JsonElement jsonElement) throws SQLException, Exception {
		String srid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "srInfoData") );
		return gson.toJson(cmc0100.selectSRInfo(srid));
	}
	
	private String getDocList(JsonElement jsonElement) throws SQLException, Exception {
		String srid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "srInfoData") );
		String strReqCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strReqCd") );
		return gson.toJson(cmc0100.getDocList(srid, strReqCd));
	}
	
	private String getDevUserList(JsonElement jsonElement) throws SQLException, Exception {
		String srid = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "srInfoData") );
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userid") );
		return gson.toJson(cmc0100.getDevUserList(srid, userId));
	}
	
	private String insertSRInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> tmp_obj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"SRInfoData"));
		
		ArrayList<HashMap<String, Object>> ConfList = new ArrayList<HashMap<String, Object>>();
		ConfList = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"confirmData"));
		
		ArrayList<HashMap<String, String>> devuser_ary = new ArrayList<HashMap<String, String>>();
		devuser_ary = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"devuser_ary"));
		
		return gson.toJson(cmc0100.insertSRInfo(tmp_obj, devuser_ary, ConfList));
	}
	
	private String updateSRInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> tmp_obj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"SRInfoData"));
		
		ArrayList<HashMap<String, Object>> ConfList = new ArrayList<HashMap<String, Object>>();
		ConfList = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"confirmData"));
		
		ArrayList<HashMap<String, String>> devuser_ary = new ArrayList<HashMap<String, String>>();
		devuser_ary = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"devuser_ary"));
		
		return gson.toJson(cmc0100.updateSRInfo(tmp_obj, devuser_ary, ConfList));
	}
}
