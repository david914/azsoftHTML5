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

import app.eCmr.Cmr0100_selectVer;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/request/ChkOutVerSelModalServlet")
public class ChkOutVerSelModalServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr0100_selectVer cmr0100_selectVer = new Cmr0100_selectVer();
	
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
				case "getVerList" :
					response.getWriter().write( getVerList(jsonElement) );
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

	private String getVerList(JsonElement jsonElement) throws SQLException, Exception {
		String ItemId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ItemId") );
		String ReqCD = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCD") );
		
		return gson.toJson(cmr0100_selectVer.getVerList(ItemId,ReqCD));
	}
}
