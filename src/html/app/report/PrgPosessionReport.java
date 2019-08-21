package html.app.report;

import java.io.IOException;
import java.sql.SQLException;
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

import app.common.SysInfo;
import app.eCmp.Cmp0300;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/PrgPosessionReport")
public class PrgPosessionReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmp0300 cmp0300 = new Cmp0300();
	
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
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getRsrcCd" :
					response.getWriter().write( getRsrcCd(jsonElement) );
					break;
				case "getProgList" :
					response.getWriter().write( getProgList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String id = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "userid"));
		return gson.toJson(cmp0300.getSysInfoOfDeptCd(id, "ALL"));
	}
	
	private String getRsrcCd(JsonElement jsonElement) throws SQLException, Exception {
		String id = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "userid"));
		String syscd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "syscd"));
		return gson.toJson(cmp0300.getRsrcCd(id, syscd));
	}
	private String getProgList(JsonElement jsonElement) throws SQLException, Exception {
		String id = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "userid"));
		String syscd = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "syscd"));
		String date = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "date"));
		return gson.toJson(cmp0300.getProgList(id, syscd, "", date, false));
	}
	
}
