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

import app.common.SystemPath;
import app.eCmr.Cmr0150;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/request/RequestDocModalServlet")
public class RequestDocModalServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SystemPath systemPath = new SystemPath();
	Cmr0150 cmr0150 = new Cmr0150();
	
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
				case "getTmpDir" :
					response.getWriter().write( getTmpDir(jsonElement) );
					break;
				case "getFileList" :
					response.getWriter().write( getFileList(jsonElement) );
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

	private String getTmpDir(JsonElement jsonElement) throws SQLException, Exception {
		String pathCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "pathCd") );
		
		return gson.toJson(systemPath.getTmpDir(pathCd));
	}
	private String getFileList(JsonElement jsonElement) throws SQLException, Exception {
		String AcptNo = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "AcptNo") );
		String GbnCd = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "GbnCd") );

		return gson.toJson(cmr0150.getFileList(AcptNo,GbnCd));
	}
}
