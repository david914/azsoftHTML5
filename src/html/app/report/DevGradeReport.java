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

import app.eCmp.Cmp6000;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/DevGradeReport")
public class DevGradeReport extends HttpServlet {
	
	Cmp6000 cmp6000 = new Cmp6000();
	
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	
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
				case "getColHeader" :
					response.getWriter().write( getColHeader(jsonElement) );
					break;
				case "getRowList" :
					response.getWriter().write( getRowList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getColHeader(JsonElement jsonElement) throws SQLException, Exception {
		String data = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "data") );
		return gson.toJson(cmp6000.getColHeader(data));
	}
	
	private String getRowList(JsonElement jsonElement) throws SQLException, Exception {
		String date = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "date") );
		String data = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "data") );
		return gson.toJson(cmp6000.getRowList(date, data));
	}
}
