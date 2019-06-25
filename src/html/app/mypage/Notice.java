package html.app.mypage;

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

import app.common.UserInfo;
import app.common.CodeInfo;
import app.common.SystemPath;
import app.eCmm.Cmm2100;
import app.eCmm.Cmm2101;
import html.app.common.ParsingCommon;
import sun.security.ssl.HandshakeMessage;

@WebServlet("/webPage/mypage/Notice")
public class Notice extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	UserInfo userinfo = new UserInfo();
	CodeInfo codeinfo = new CodeInfo();
	SystemPath systempath = new SystemPath();
	Cmm2100 cmm2100 = new Cmm2100();
	Cmm2101 cmm2101 = new Cmm2101();
	
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
				case "UserInfo" :
					response.getWriter().write( checkAdmin(jsonElement) );
					break;
				case "CodeInfo" :
					response.getWriter().write( getCodeInfo(jsonElement) );
					break;
				case "getNoticeIfno" :
					response.getWriter().write( getNoticeIfno(jsonElement) );
					break;
				case "SystemPath" :
					response.getWriter().write( getSysPass(jsonElement) );
					break;
				case "insertNoticeFileInfo" :
					response.getWriter().write( insertNoticeFileInfo(jsonElement) );
					break;
				case "getFileList" :
					response.getWriter().write( getFileList(jsonElement) );
					break;
				case "getNoticeFolderPath" :
					response.getWriter().write( getNoticeFolderPath(jsonElement) );
					break;
				case "deleteNoticeFile" :
					response.getWriter().write( deleteNoticeFile(jsonElement) );
					break;
				case "BIG_DATA_LOADING_TEST" :
					response.getWriter().write( getBigDataTest(jsonElement) );
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
	
	// [��������] ���� üũ
	private String checkAdmin(JsonElement jsonElement) throws SQLException, Exception {
		String userId = null;
		userId = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "UserId") );
		return gson.toJson(userinfo.isAdmin(userId));
	}
	
	// [��������] �ڵ�������������
	private String getCodeInfo(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(codeinfo.getCodeInfo("FIND","","N"));
	}
	
	// [��������] �������� ����Ʈ��������
	private String getNoticeIfno(JsonElement jsonElement) throws SQLException, Exception {
		String cboFindMicode = ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "CboFind_micode") );
		String txtFindText 	= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "TxtFind_text") );
		String dateStD 		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "dateStD") );
		String dateEdD 		= ParsingCommon.jsonStrToStr( ParsingCommon.jsonEtoStr(jsonElement, "dateEdD") );
		return gson.toJson(cmm2100.get_sql_Qry(cboFindMicode, txtFindText, dateStD, dateEdD));
	}
	
	private String getSysPass(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(systempath.getTmpDir("99"));
	}
	
	// [��������] �������� ���
	private String insertNoticeFileInfo(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> tmpList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement, "fileInfo") );
		ArrayList<HashMap<String, String>> fileList = new  ArrayList<HashMap<String,String>>();
		for(int i=0; i<tmpList.size(); i++) {
			HashMap<String, String> addMap = new HashMap<>();
			addMap.put("acptno", tmpList.get(i).get("noticeAcptno"));
			addMap.put("filegb", "1");
			addMap.put("realName", tmpList.get(i).get("fileName"));
			addMap.put("saveName", tmpList.get(i).get("noticeAcptno")+"."+(i + 1));
			fileList.add(addMap);
		}
		return gson.toJson(cmm2101.setDocFile(fileList));
	}
	
	//[��������] ÷������ ����Ʈ ��������
	private String getFileList(JsonElement jsonElement) throws SQLException, Exception {
		String acptno = ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement, "acptno") );
		return gson.toJson(cmm2100.getFileList(acptno));
	}
	
	// [��������] �������� ���ε� ���丮 ��������
	private String getNoticeFolderPath(JsonElement jsonElement) throws SQLException, Exception {
		return gson.toJson(systempath.getTmpDir("01"));
	}
	// [��������] �������� ÷������ ����
	private String deleteNoticeFile(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String> fileData = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "fileData") );
		return gson.toJson(cmm2101.removeDocFileHtml(fileData));
	}
	
	
	
	
	
	// �׽�Ʈ �޼ҵ� �Դϴ�. 
	private String getBigDataTest(JsonElement jsonElement) throws SQLException, Exception {
		for(long i=0; i<1000000000; i++) {
			if(i%10000 ==0 ) System.out.println("�����Ͱ���������...  [i] = " + i);
		}
		for(long i=0; i<1000000000; i++) {
			if(i%10000 ==0 ) System.out.println("�����Ͱ���������...  [i] = " + i);
		}
		for(long i=0; i<1000000000; i++) {
			if(i%10000 ==0 ) System.out.println("�����Ͱ���������...  [i] = " + i);
		}
		for(long i=0; i<1000000000; i++) {
			if(i%10000 ==0 ) System.out.println("�����Ͱ���������...  [i] = " + i);
		}
		for(long i=0; i<1000000000; i++) {
			
			if(i%10000 ==0 ) System.out.println("�����Ͱ���������...  [i] = " + i);
		}
		return gson.toJson("OK");
	}
	
}
