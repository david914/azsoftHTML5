package html.app.apply;

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

import app.eCmd.Cmd0100;

import html.app.common.ParsingCommon;

@WebServlet("/webPage/apply/ApplyRequest")
public class ApplyRequest extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmd0100 cmd0100  = new Cmd0100();
	
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
				case "RSRCOPEN" :
					response.getWriter().write( getRsrcOpen(jsonElement) );
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

	private String getRsrcOpen(JsonElement jsonElement) throws SQLException, Exception {
		String SysCd = null;
		SysCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SysCd") );
		String SelMsg = null;
		SelMsg = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		
		System.out.println(SysCd+":"+SelMsg);
		return gson.toJson(cmd0100.getRsrcOpen(SysCd,SelMsg));
	}
	
}
