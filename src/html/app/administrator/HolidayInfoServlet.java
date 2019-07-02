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

import app.eCmm.Cmm1000;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/HolidayInfoServlet")
public class HolidayInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm1000 cmm1000 = new Cmm1000();
	
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
				case "getHoliDayList" :
					response.getWriter().write( getHoliDay(jsonElement));
					break;
				case "checkHoli" :
					response.getWriter().write( checkHoliday(jsonElement));
					break;
				case "addHoli" :
					response.getWriter().write( addHoliday(jsonElement));
					break;
				case "delHoliday" :
					response.getWriter().write( delHoliday(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	// [휴일정보] 휴일정보 리스트 가져오기
	private String getHoliDay(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> holiInfoMap =  new HashMap<String, String>();
		holiInfoMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"holiday")); //jsonEtoStr(JsonElement jsonElement, String key)
		return gson.toJson(cmm1000.getHoliDay(holiInfoMap.get("year")));
	}
	// [휴일정보] 이미 있는 휴일인지 체크
	private String checkHoliday(JsonElement jsonElement) throws SQLException, Exception {
		String nDate = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"nDate"));
		return gson.toJson(cmm1000.chkHoliDay(nDate));
	}
	// [휴일정보] 휴일정보 등록
	private String addHoliday(JsonElement jsonElement) throws SQLException, Exception {
		String nDate 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"nDate"));
		String holigb 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"holigb"));
		String holi 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"holi"));
		String ntype 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"ntype"));
		return gson.toJson(cmm1000.addHoliday(nDate, holigb, holi, Integer.parseInt(ntype)));
	}
	// [휴일정보] 휴일정보 삭제
	private String delHoliday(JsonElement jsonElement) throws SQLException, Exception {
		String nDate = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"nDate"));
		return gson.toJson(cmm1000.delHoliday(nDate));
	}
	
}
