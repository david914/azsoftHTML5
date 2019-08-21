package html.app.tab.SR;

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
import app.eCmc.Cmc0300;
import app.eCmr.Cmr3100;
import html.app.common.ParsingCommon;

/**
 * Servlet implementation class SRCompleteTab
 */
@WebServlet("/webpage/tab/SR/SRCompleteTab")
public class SRCompleteTab extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	Gson gson = new Gson();
	PrjInfo prjinfo = new PrjInfo();
	Cmr3100 cmr3100 = new Cmr3100();
	
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
				case "getRealTime" :
					response.getWriter().write( getRealTime(jsonElement) );
					break;
				case "getAcptNo" :
					response.getWriter().write( getAcptNo(jsonElement) );
					break;
				case "gyulChk" :
					response.getWriter().write( gyulChk(jsonElement) );
					break;
				case "getSREnd" :
					response.getWriter().write( getSREnd(jsonElement) );
					break;
				case "nextConf" :
					response.getWriter().write( nextConf(jsonElement) );
					break;
				case "insertSREnd" :
					response.getWriter().write( insertSREnd(jsonElement) );
					break;	
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getRealTime(JsonElement jsonElement) throws SQLException, Exception {
		String srId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strIsrId") );
		return gson.toJson(prjinfo.getRealTime(srId));
	}
	
	private String getSREnd(JsonElement jsonElement) throws SQLException, Exception {
		String srId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strIsrId") );
		return gson.toJson(prjinfo.getSREnd(srId));
	}
	
	private String getAcptNo(JsonElement jsonElement) throws SQLException, Exception {
		String srId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strIsrId") );
		return gson.toJson(prjinfo.getAcptNo(srId));
	}
	
	private String gyulChk(JsonElement jsonElement) throws SQLException, Exception {
		String strAcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strAcptNo") );
		String strUserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strUserId") );
		return gson.toJson(cmr3100.gyulChk(strAcptNo, strUserId));
	}
	
	private String nextConf(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> gyulDataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "gyulData") );
		String cnt = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cnt") );
		return gson.toJson(cmr3100.nextConf(gyulDataMap.get("strAcptno"), gyulDataMap.get("strUserId"), gyulDataMap.get("txtConMsg"), cnt, gyulDataMap.get("strReqCd")));
	}
	
	private String insertSREnd(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> tmp_obj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"EndSRData"));
		
		ArrayList<HashMap<String, Object>> ConfList = new ArrayList<HashMap<String, Object>>();
		ConfList = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"confirmData"));

		return gson.toJson(prjinfo.insertSREnd(tmp_obj, ConfList));
	}
	
}

