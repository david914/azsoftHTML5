/**
 * 체크아웃 화면 서블릿 
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-01-29
 */

package html.app.dev;
import java.io.*;
import java.sql.SQLException;
import java.util.*;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.Part;
import com.oreilly.servlet.multipart.FilePart;
import com.oreilly.servlet.multipart.MultipartParser;
import com.oreilly.servlet.multipart.ParamPart;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.*;
import com.google.gson.internal.LinkedTreeMap;

import app.common.PrjInfo;
import app.common.SysInfo;
import app.eCmr.Cmr0100;
import app.eCmr.Cmr0101;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/dev/CheckOutCnlServlet")
public class CheckOutCnlServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final JsonElement SystemPath = null;
	Gson gson = new Gson();
	SysInfo sysinfo = new SysInfo();
	PrjInfo prjInfo = new PrjInfo();
	Cmr0101 Cmr0101 = new Cmr0101();
	
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
				case "getPrjList" :
					response.getWriter().write( getPrjList(jsonElement) );
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
		}
		
	}//end of getSysInfo() method statement
	
	private String getPrjList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 srMap = null;
		srMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "srData"));
		return gson.toJson( prjInfo.getPrjList(srMap));
	}
	
	
	private String getSysInfo(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 sysMap = null;
		sysMap =  ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "sysData"));
		return gson.toJson( sysinfo.getSysInfo(
								sysMap.get("UserId"), 
								sysMap.get("SecuYn"), 
								sysMap.get("SelMsg"), 
								sysMap.get("CloseYn"), 
								sysMap.get("ReqCd")));
	}


	private String getFileList(JsonElement jsonElement) throws SQLException, Exception {
		HashMap<String, String>				 fileListMap = null;
		fileListMap = ParsingCommon.jsonStrToMap(ParsingCommon.jsonEtoStr(jsonElement, "getFileListData"));
		return gson.toJson( Cmr0101.getFileList(fileListMap));
	}
}
