package html.app.modal.sysinfo;

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

import app.eCmm.Cmm0100;
import app.eCmm.Cmm0200_Copy;
import app.eCmm.Cmm0200_Prog;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/sysinfo/PrgSeqServlet")
public class PrgSeqServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	Gson gson = new Gson();
	Cmm0100 cmm0100 = new Cmm0100();
	Cmm0200_Copy cmm0200_copy = new Cmm0200_Copy();
	Cmm0200_Prog cmm0200_prog = new Cmm0200_Prog();
	
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
				case "getProgInfoTree" :
					response.getWriter().write(getProgInfoTree(jsonElement));
					break;
				case "getCodeSelInfo" :
					response.getWriter().write(getCodeSelInfo(jsonElement));
					break;
				case "insertNewDir" :
					response.getWriter().write(insertNewDir(jsonElement));
					break;
				case "checkDelDir" :
					response.getWriter().write(checkDelDir(jsonElement));
					break;
				case "delDir" :
					response.getWriter().write(delDir(jsonElement));
					break;
				case "updateProgInfo" :
					response.getWriter().write(updateProgInfo(jsonElement));
					break;
				case "reNameDir" :
					response.getWriter().write(reNameDir(jsonElement));
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� Ʈ�� ��������
	private String getProgInfoTree(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(cmm0100.getProgInfoZTree());
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� �ڵ� ��������
	private String getCodeSelInfo(JsonElement jsonElement) throws SQLException, Exception {
		String res = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "res") );
		return gson.toJson(cmm0100.getCodeSelInfo(res));
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� Ʈ�� �߰� / �����߰�
	private String insertNewDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subNewDir(dataObj));
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� Ʈ�� ���� Ȯ��
	private String checkDelDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subDelDir_Check(dataObj));
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� Ʈ�� ����
	private String delDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subDelDir(dataObj));
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� ������Ʈ
	private String updateProgInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.updtProgInfo(dataObj));
	}
	
	// [�ý������� > ���α׷��������� > ���α׷�������ó���Ӽ�����]  ó���Ӽ� Ʈ�����и� ����
	private String reNameDir(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> dataObj = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "dataObj") );
		return gson.toJson(cmm0100.subRename(dataObj));
	}
	
	
}
