package html.app.modal.approvalInfo;

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

import app.eCmm.Cmm0300_Blank;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/approvalInfo/rangeApprovalInfoServlet")
public class rangeApprovalInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson 		  gson 		    = new Gson();
	Cmm0300_Blank cmm0300_blank = new Cmm0300_Blank();
	
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
				case "GETBLANKLIST" :
					response.getWriter().write( getBlankList(jsonElement) );
					break;
				case "UPDATEBLANKLIST" : 
					response.getWriter().write( updateBlankList(jsonElement) );
					break;
				case "DELETEBLANKLIST" : 
					response.getWriter().write( deleteBlankList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}
	
	/* 대결범위 조회 */
	private String getBlankList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300_blank.getBlankList(DataMap.get("gbnCd"),
													  DataMap.get("posCd")));
	}
	
	/* 대결범위 등록 */
	private String updateBlankList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300_blank.blankUpdt(DataMap));
	}
	
	/* 대결범위 폐기 */
	private String deleteBlankList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> DataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "tmpInfo") );
		return gson.toJson(cmm0300_blank.blankClose(DataMap));
	}
}
