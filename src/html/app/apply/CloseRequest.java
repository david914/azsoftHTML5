package html.app.apply;

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

import app.eCmr.Cmr0300;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/apply/CloseRequest")
public class CloseRequest extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmr0300 cmr0300  = new Cmr0300();
		
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
				case "PROGRAM_LIST" :
					response.getWriter().write( getDeployList(jsonElement) );
					break;
				case "getDownFileList" :
					response.getWriter().write( getDownFileList(jsonElement) );
					break;
				case "requestConf" :
					response.getWriter().write( requestConf(jsonElement) );
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
	private String getDeployList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> prjMap = new HashMap<String, String>();
		prjMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"param"));
		
		return gson.toJson(cmr0300.getCloseList(prjMap));
	}

	private String requestConf(JsonElement jsonElement) throws SQLException, Exception {
		
		ArrayList<HashMap<String, String>> secondGridData = new ArrayList<HashMap<String, String>>();
		secondGridData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"secondGridData"));

		HashMap<String, String> requestData = new HashMap<String, String>();
		requestData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"requestData"));
		
		ArrayList<HashMap<String, Object>> requestConfirmData = new ArrayList<HashMap<String, Object>>();
		requestConfirmData = ParsingCommon.jsonStrToArrObj(ParsingCommon.jsonEtoStr(jsonElement,"requestConfirmData"));
		
		ArrayList<HashMap<String, String>> befJobData = new ArrayList<HashMap<String, String>>();
		befJobData = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"befJobData"));
		return gson.toJson(cmr0300.request_Close(secondGridData, requestData, befJobData, requestConfirmData, "Y"));
	}
	private String getDownFileList(JsonElement jsonElement) throws SQLException, Exception {
		
		ArrayList<HashMap<String, String>> fileList = new ArrayList<HashMap<String, String>>();
		fileList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"fileList"));
		
		HashMap<String, String> etcData = new HashMap<String, String>();
		etcData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement,"downFileData"));
		return gson.toJson(cmr0300.getDownCloseList(fileList,etcData));
	}
}
