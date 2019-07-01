package html.app.administrator;

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

import app.common.SysInfo;
import app.eCmm.Cmm2900;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/administrator/FileConfiguration")
public class FileConfiguration extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	Cmm2900 cmm2900 = new Cmm2900();
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
				case "getSysInfo" :
					response.getWriter().write( getSysInfo(jsonElement) );
					break;
				case "getFileInf" :
					response.getWriter().write( getFileInf(jsonElement) );
					break;
				case "setFileInf" :
					response.getWriter().write( setFileInf(jsonElement) );
					break;
				case "getSysDir" :
					response.getWriter().write( getSysDir(jsonElement) );
					break;
				case "setEtcDir" :
					response.getWriter().write( setEtcDir(jsonElement) );
					break;
				case "getEtcDir" :
					response.getWriter().write( getEtcDir(jsonElement) );
					break;
				case "getHandrunDiff" :
					response.getWriter().write( getHandrunDiff(jsonElement) );
					break;
				case "setHandrunDiff" :
					response.getWriter().write( setHandrunDiff(jsonElement) );
					break;
				case "delHandrunDiff" :
					response.getWriter().write( delHandrunDiff(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	
	// [���ϴ��ȯ�漳�� > �⺻���� tab] �ý���������������
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String SelMsg 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SelMsg") );
		String CloseYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CloseYn") );
		String ReqCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "ReqCd") );
		return gson.toJson(sysinfo.getSysInfo(UserId, SecuYn, SelMsg, CloseYn, ReqCd));
	}
	
	// [���ϴ��ȯ�漳�� > �⺻���� tab] ���ϴ�� �⺻���� ��������
	private String getFileInf(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		String cboJobRuncd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "cboJobRuncd") );
		return gson.toJson(cmm2900.getFileInf(UserId, SecuYn, cboJobRuncd));
	}
	
	// [���ϴ��ȯ�漳�� > �⺻���� tab] �⺻�������
	private String setFileInf(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String SecuYn 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "SecuYn") );
		HashMap<String, String> etcData	= ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(cmm2900.setFileInf(UserId, SecuYn, etcData));
	}
	
	
	// [���ϴ��ȯ�漳�� > ���ܵ��丮���� tab] ���丮��������
	private String getSysDir(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String dirPath 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "dirPath") );
		return gson.toJson(cmm2900.getSysDir(UserId, dirPath));
	}
	// [���ϴ��ȯ�漳�� > ���ܵ��丮���� tab] ���丮��������
	private String setEtcDir(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String gbnCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		ArrayList<HashMap<String, String>> dirList 	= ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "dirList") );
		return gson.toJson(cmm2900.setEtcDir(UserId, gbnCd, dirList));
	}
	// [���ϴ��ȯ�漳�� > ���ܵ��丮���� tab] ���ܵ��丮��������
	private String getEtcDir(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm2900.getEtcDir(UserId));
	}
	
	// [���ϴ��ȯ�漳�� > �������ϴ��] �������ϴ�� ����Ʈ ��������
	private String getHandrunDiff(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(cmm2900.getHandrun_diff(UserId));
	}
	// [���ϴ��ȯ�漳�� > �������ϴ��] �������ϴ�� ���� ���
	private String setHandrunDiff(JsonElement jsonElement) throws SQLException, Exception {
		String UserId 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		String gbnCd 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "gbnCd") );
		HashMap<String, String> etcData = ParsingCommon.jsonStrToMap( ParsingCommon.jsonEtoStr(jsonElement, "etcData") );
		return gson.toJson(cmm2900.setHandrun_diff(UserId, gbnCd, etcData));
	}
	// [���ϴ��ȯ�漳�� > �������ϴ��] �������ϴ�� ���� ����
	private String delHandrunDiff(JsonElement jsonElement) throws SQLException, Exception {
		String UserId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		ArrayList<HashMap<String, String>> dirList = ParsingCommon.jsonArrToArr( ParsingCommon.jsonEtoStr(jsonElement, "dirList") );
		return gson.toJson(cmm2900.delHandrun_diff(UserId, dirList));
	}
}
