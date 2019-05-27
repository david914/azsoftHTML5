package html.app.modal;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import app.eCmm.Cmm2101;
import html.app.common.ParsingCommon;

@WebServlet("/webPage/modal/PopNotice")
public class PopNotice extends HttpServlet {
	private static final long serialVersionUID = 1L;
	Gson gson = new Gson();
	Cmm2101 cmm2101 = new Cmm2101();
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HashMap paramMap = ParsingCommon.reqParamToMap(request); 
		String requestType = (String)paramMap.get("requestType");
		
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("UTF-8");
			
			switch (requestType) {
				case "Cmm2101" :
					response.getWriter().write( getNoticeInfo(paramMap) );
					break;
				case "Cmm2101_1" :
					response.getWriter().write( update(paramMap) );
					break;
				case "Cmm2101_2" :
					response.getWriter().write( delete(paramMap) );
					break;
				default:
					break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	private String getNoticeInfo(HashMap paramMap) throws SQLException, Exception {
		HashMap<String, String> dataMap = ParsingCommon.parsingRequestJsonParamToHashMap( (String)paramMap.get("dataObj").toString());
		return gson.toJson(cmm2101.get_sql_Qry(dataMap.get("memo_id"), dataMap.get("memo_date")));
	}
	
	private String update(HashMap paramMap) throws SQLException, Exception {
		HashMap<String, String> updateMap = ParsingCommon.parsingRequestJsonParamToHashMap((String)paramMap.get("dataObj").toString());
		return gson.toJson(cmm2101.get_update_Qry(updateMap.get("memo_id"), 
												  updateMap.get("user_id"), 
												  updateMap.get("txtTitle"), 
												  updateMap.get("textareaContents"),
												  updateMap.get("chkNotice"),
												  updateMap.get("stDate"),
												  updateMap.get("edDate")));
	}
	
	
	private String delete(HashMap paramMap) throws SQLException, Exception {
		HashMap<String, String> updateMap = ParsingCommon.parsingRequestJsonParamToHashMap((String)paramMap.get("dataObj").toString());
		
		return gson.toJson(cmm2101.get_delete_Qry(updateMap.get("memo_id"), 
												  updateMap.get("user_id"), 
												  updateMap.get("txtTitle"), 
												  updateMap.get("textareaContents"),
												  updateMap.get("chkNotice"),
												  updateMap.get("stDate"),
												  updateMap.get("edDate")));
	}

}
