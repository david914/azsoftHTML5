package html.app.administrator;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import app.common.CodeInfo;
import app.eCmm.Cmm0100;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/CodeInfo")
public class CodeInfoServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	CodeInfo codeInfo = new CodeInfo();
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
				case "GETCODEINFO" :
					response.getWriter().write( getCodeInfo(jsonElement) );
					break;
				case "getCodeList" :
					response.getWriter().write( getCodeList(jsonElement) );
					break;
				case "getCodeName" :
					response.getWriter().write( getCodeName(jsonElement) );
					break;
				case "setCodeValue" :
					response.getWriter().write( setCodeValue(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	private String getCodeInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> codeInfoMap = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "codeInfoData") );
		return gson.toJson(codeInfo.getCodeInfo(codeInfoMap.get("cm_macode"),codeInfoMap.get("selMsg"), codeInfoMap.get("closeYN")));
	}
	
	// [�ڵ�����] �ڵ帮��Ʈ ��������
	private String getCodeList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.getCodeList(dataObj));
	}
	// [�ڵ�����] �ڵ�� ��������
	private String getCodeName(JsonElement jsonElement) throws SQLException, Exception {
		String txtCode0 = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "txtCode0") ); 
		return gson.toJson(cmm0100.getCodeName(txtCode0));
	}
	// [�ڵ�����] �ڵ����� ����
	private String setCodeValue(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.setCodeValue(dataObj));
	}
}
