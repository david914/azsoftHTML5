package html.app.modal.request;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.eCmr.Cmr0200_BefJob;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/request/BefJobListModalServlet")
public class BefJobListModalServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr0200_BefJob cmr0200_BefJob = new Cmr0200_BefJob();
	
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
				case "delBefJob" :
					response.getWriter().write( delBefJob(jsonElement) );
					break;
				case "befJob_List" :
					response.getWriter().write( befJob_List(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			requestType = null;
		}
		
	}

	private String delBefJob(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String befAcpt = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "befAcpt") );
		
		return gson.toJson(cmr0200_BefJob.delBefJob(AcptNo,befAcpt));
	}

	private String befJob_List(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		
		return gson.toJson(cmr0200_BefJob.befJob_List(AcptNo));
	}

}
