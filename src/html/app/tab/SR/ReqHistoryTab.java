package html.app.tab.SR;

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

import app.common.PrjInfo;
import app.eCmc.Cmc0300;
import html.app.common.ParsingCommon;

/**
 * Servlet implementation class ReqHistoryTab
 */
@WebServlet("/webpage/tab/SR/ReqHistoryTab")
public class ReqHistoryTab extends HttpServlet {

	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmc0300 cmc0300 = new Cmc0300();
	PrjInfo prjinfo = new PrjInfo();
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
				case "getScmuserList" :
					response.getWriter().write( getScmuserList(jsonElement) );
					break;
				case "getAcptHist" :
					response.getWriter().write( getAcptHist(jsonElement) );
					break;	
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getScmuserList(JsonElement jsonElement) throws SQLException, Exception {
		String srId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strIsrId") );
		String reqCD = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "strReqCd") );
		String userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "userId") );
		return gson.toJson(cmc0300.getScmuserList(srId,reqCD,userId));
	}
	
	private String getAcptHist(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> ReqInfoDataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "ReqInfoData") );
		return gson.toJson(prjinfo.getAcptHist(ReqInfoDataMap.get("strIsrId"),ReqInfoDataMap.get("cc_scmuser"),ReqInfoDataMap.get("rdoChk")));
	}
}
