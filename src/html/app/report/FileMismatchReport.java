package html.app.report;

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

import app.eCmp.Cmp2900;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/report/FileMismatchReport")
public class FileMismatchReport extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmp2900 cmp2900 = new Cmp2900();
	
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
				case "getMismatchList" :
					response.getWriter().write( getMismatchList(jsonElement) );
					break;
				case "insertMismatch" :
					response.getWriter().write( insertMismatch(jsonElement) );
					break;
				case "delMismatchList" :
					response.getWriter().write( delMismatchList(jsonElement) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
		
	}
	// [파일대사불일치현황] 불일치 현황 가져오기
	private String getMismatchList(JsonElement jsonElement) throws SQLException, Exception {
		String chk 		= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"chk"));
		String strstd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"strstd"));
		String stredd 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"stredd"));
		String errday 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"errday"));
		String userid 	= ParsingCommon.jsonStrToStr(ParsingCommon.jsonEtoStr(jsonElement,"userid"));
		return gson.toJson(cmp2900.CmdQry(chk, strstd, stredd, errday, userid));
	}
	// [파일대사불일치현황] 불일치 등록
	private String insertMismatch(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> dataList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"dataList"));
		return gson.toJson(cmp2900.CmdInsert(dataList));
	}
	// [파일대사불일치현황] 불일치 삭제
	private String delMismatchList(JsonElement jsonElement) throws SQLException, Exception {
		ArrayList<HashMap<String, String>> dataList = ParsingCommon.jsonArrToArr(ParsingCommon.jsonEtoStr(jsonElement,"dataList"));
		return gson.toJson(cmp2900.CmdDelete(dataList));
	}
}
