package html.app.administrator;

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

import app.eCmm.Cmm1600;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/CommandExcute")
public class CommandExcute extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm1600 cmm1600 = new Cmm1600();
	
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
				case "getExecCmd" :
					response.getWriter().write( getExecCmd(jsonElement) );
					break;
				case "getExecQry" :
					response.getWriter().write( getExecQry(jsonElement) );
					break;
				case "getFileView" :
					response.getWriter().write( getFileView(jsonElement) );
					break;
				case "fileAttUpdt" :
					response.getWriter().write( fileAttUpdt(jsonElement) );
					break;
				case "getRemoteUrl" :
					response.getWriter().write( getRemoteUrl(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	private String getExecCmd(JsonElement jsonElement) throws SQLException, Exception {
		boolean view = false;
		HashMap<String, String>	cmdDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "cmdData") );
		if (cmdDataInfoMap.get("view").equals("ok")) {
			view = true;
		} else {
			view = false;
		}
		return gson.toJson(cmm1600.execCmd(cmdDataInfoMap.get("txtcmd"), cmdDataInfoMap.get("userid"),cmdDataInfoMap.get("gbnCd"),view ) );
	}
	private String getExecQry(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	cmdDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "cmdData") );
		return gson.toJson(cmm1600.get_SqlList(cmdDataInfoMap.get("txtcmd"),  cmdDataInfoMap.get("dbGbnCd")));
	}
	private String getFileView(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	cmdDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "cmdData") );
		return gson.toJson(cmm1600.getFileView(cmdDataInfoMap.get("txtcmd") ));
	}
	private String fileAttUpdt(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	cmdDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "cmdData") );
		return gson.toJson(cmm1600.fileAttUpdt(cmdDataInfoMap.get("txtcmd") ));
	}
	private String getRemoteUrl(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>	cmdDataInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "cmdData") );
		return gson.toJson(cmm1600.getRemoteUrl(cmdDataInfoMap.get("txtcmd"), cmdDataInfoMap.get("userid"),cmdDataInfoMap.get("gbnCd"),cmdDataInfoMap.get("savePath") ) );
	}
}
