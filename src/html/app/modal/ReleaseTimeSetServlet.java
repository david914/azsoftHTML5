package html.app.modal;

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

import app.eCmm.Cmm0200;
import app.eCmm.Cmm2101;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/ReleaseTimeSet")
public class ReleaseTimeSetServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	
	Cmm0200 cmm0200 = new Cmm0200();
	
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
				case "getReleaseTime" :
					response.getWriter().write( getReleaseTime() );
					break;
				case "setReleaseTime" :
					response.getWriter().write( setReleaseTime(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	private String getReleaseTime() throws SQLException, Exception {
		return gson.toJson(cmm0200.getReleaseTime());
	}
	
	private String setReleaseTime(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> releaseGridData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "releaseGridData") );
		String txtTime = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "txtTime") );
		return gson.toJson(cmm0200.setReleaseTime(releaseGridData, txtTime));
	}
}
