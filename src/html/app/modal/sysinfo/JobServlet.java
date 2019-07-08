package html.app.modal.sysinfo;

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

import app.eCmm.Cmm0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/sysinfo/Job")
public class JobServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	
	Cmm0100 cmm0100 = new Cmm0100();
	
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
				case "getJobList" :
					response.getWriter().write( getJobList() );
					break;
				case "setJobInfo" :
					response.getWriter().write( setJobInfo(jsonElement) );
					break;
				case "delJobInfo" :
					response.getWriter().write( delJobInfo(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	
	private String getJobList() throws SQLException, Exception {
		return gson.toJson(cmm0100.getJobList());
	}
	
	private String setJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		String code = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "code") );
		String value = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "value") );
		
		return gson.toJson(cmm0100.setJobInfo_individual(code, value));
	}
	private String delJobInfo(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> delJobList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "delJobList") );
		return gson.toJson(cmm0100.delJobInfo(delJobList));
	}
}
