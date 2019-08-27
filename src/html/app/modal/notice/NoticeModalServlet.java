package html.app.modal.notice;

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

import app.eCmm.Cmm2101;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/notice/NoticeModal")
public class NoticeModalServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm2101 cmm2101 = new Cmm2101();
	
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
				case "Cmm2101" :
					response.getWriter().write( getNoticeInfo(jsonElement) );
					break;
				case "updateNotice" :
					response.getWriter().write( updateNotice(jsonElement) );
					break;
				case "deleteNotice" :
					response.getWriter().write( deleteNotice(jsonElement) );
					break;
				case "getTodayPopNotice" :
					response.getWriter().write( getTodayPopNotice(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	private String getNoticeInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm2101.get_sql_Qry(dataMap.get("memo_id"), dataMap.get("memo_date")));
	}
	
	private String updateNotice(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> updateMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm2101.get_update_Qry(updateMap.get("memo_id"), 
												  updateMap.get("user_id"), 
												  updateMap.get("txtTitle"), 
												  updateMap.get("textareaContents"),
												  updateMap.get("chkNotice"),
												  updateMap.get("stDate"),
												  updateMap.get("edDate")));
	}
	
	
	private String deleteNotice(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> updateMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		
		return gson.toJson(cmm2101.get_delete_Qry(updateMap.get("memo_id"), 
												  updateMap.get("user_id"), 
												  updateMap.get("txtTitle"), 
												  updateMap.get("textareaContents"),
												  updateMap.get("chkNotice"),
												  updateMap.get("stDate"),
												  updateMap.get("edDate")));
	}
	
	// 금일 공지사항 팝업 있는지 체크
	private String getTodayPopNotice(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm2101.getTodayPopNotice());
	}

}
