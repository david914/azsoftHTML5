package html.app.fileupload;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.LinkedList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.ecams.common.logger.EcamsLogger;
import com.fasterxml.jackson.databind.ObjectMapper;

import html.app.fileupload.vo.FileMeta;

//this to be used with Java Servlet 3.0 API
@MultipartConfig 
@WebServlet("/webPage/fileupload/upload")
public class FileUploadServlet extends HttpServlet {
	
	/*
	 * FileUploadServlet.java는 클라이언트 요청을 수신하는 서블릿입니다.
	 * 파일 업로드 요청을 처리하는 doPost ()와 파일 다운로드 요청을 처리하는 doGet ()의 두 가지 메소드가 있습니다.
	 * doPost () 응답 내용은 JSON 형식입니다.
	 */

	// this will store uploaded files
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	static Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	/***************************************************
	 * URL: /upload
	 * doPost(): upload the files and other parameters
	 ****************************************************/
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException{
		// 1. Upload File Using Java Servlet API
		List<FileMeta> files = new LinkedList<FileMeta>();
		try {
			// 1. Upload File Using Apache FileUpload
			files.addAll(MultipartRequestHandler.uploadByApacheFileUpload(request));
			ecamsLogger.error("********************************************fileUpload SErvlet START4*****************");
			
			// 2. Set response type to json
			response.setContentType("application/json");
			
			// 3. Convert List<FileMeta> into JSON format
	    	ObjectMapper mapper = new ObjectMapper();
	    	// 4. Send resutl to client
	    	ecamsLogger.error("********************************************fileUpload SErvlet START4*****************" + files.toString());
	    	mapper.writeValue(response.getOutputStream(), files);
		} catch (Exception e) {
			e.printStackTrace();
		}
	
	}
	
	// 파일 다운로드
	/***************************************************
	 * URL: /upload?f=value
	 * doGet(): get file of index "f" from List<FileMeta> as an attachment
	 ****************************************************/
	/*protected void doGet(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException{
		String setFileName		= null;
		String fileName			= null;
		String folderPath 		= request.getParameter("folderPath");
		String userAgent 		= request.getHeader("User-Agent");
		
		boolean ie = (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1);
		
		fileName = folderPath.substring(folderPath.lastIndexOf("\\"), folderPath.length());
		System.out.println(fileName);
		if(ie) {
			setFileName = URLEncoder.encode( fileName, "UTF-8" ).replaceAll("\\+", "%20");
		} else{
			setFileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			
		}
		response.setHeader("Content-Disposition", "attachment; filename=\"" + setFileName + "\"");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Connection", "close");
		
		try {	
			
			FileInputStream input 	= new FileInputStream(folderPath); 
			OutputStream output = response.getOutputStream();
			byte[] buffer = new byte[1024*10];
			
			for (int length = 0; (length = input.read(buffer)) > 0;) {
				output.write(buffer, 0, length);
			}
			    
			output.close();
			input.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
	
	}*/
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	        throws ServletException, IOException{
		
		String fullPath 		= request.getParameter("fullPath");
		String fileName 		= request.getParameter("fileName");
		String zipPath			= request.getParameter("zipPath");
		String zipName			= request.getParameter("zipName");
		String userAgent 		= request.getHeader("User-Agent");
		boolean zipSw			= false;
		String outputName		= null;
		int bufferSize 			= 1024 * 10;
		
		if(zipPath != null) {
			zipSw = true;
		}
		
		boolean ie = (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1);
		boolean winOs = System.getProperty("os.name").toLowerCase().indexOf("win") >=0 ? true : false; 
		ecamsLogger.error("check doGet winos: " + winOs );
		/*if(winOs) {
			fullPath.replaceAll("/", "\\");
		} else {
			fullPath.replaceAll("\\", "/");
		}*/
		
		
		ecamsLogger.error("check doGet winos: " + fullPath );
		if(ie) {
			if(zipSw) {
				zipName = URLEncoder.encode( zipName, "UTF-8" ).replaceAll("\\+", "%20");
			} else {
				fileName = URLEncoder.encode( fileName, "UTF-8" ).replaceAll("\\+", "%20");
			}
		} else{
			if(zipSw) {
				zipName = new String(zipName.getBytes("UTF-8"), "ISO-8859-1");
			} else {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			}
		}
		
		ecamsLogger.error("check doGet winos: " + fileName);
		
		outputName = zipSw ? zipName + ".zip" : fileName;
		
		response.setHeader("Content-Disposition", "attachment; filename=\"" + outputName + "\"");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Connection", "close");
		try {
			if(zipSw) {
				ZipOutputStream zos = null;
			    OutputStream os = response.getOutputStream();
			    zos = new ZipOutputStream(os);
			    // 압축 레벨 - 최대 압축률은 9, 디폴트 8
			    zos.setLevel(8);
			    BufferedInputStream bis = null;
			    
			    File dirFile = new File(zipPath);
				File[] fileList = dirFile.listFiles();
				
				for(File tempFile : fileList) {
					if(tempFile.isFile()) {
						File sourceFile = new File(zipPath+File.separator+tempFile.getName());
				        bis = new BufferedInputStream(new FileInputStream(sourceFile));
				        ZipEntry zentry = new ZipEntry(tempFile.getName());
				        zentry.setTime(sourceFile.lastModified());
				        zos.putNextEntry(zentry);
				        
				        byte[] buffer = new byte[bufferSize];
				        int cnt = 0;
				        while ((cnt = bis.read(buffer, 0, bufferSize)) != -1) {
				            zos.write(buffer, 0, cnt);
				        }
				        zos.closeEntry();
					}
				}
			       
			    zos.close();
			    bis.close();
				
			} else {
				FileInputStream input 	= new FileInputStream(fullPath); 
				OutputStream output = response.getOutputStream();
				byte[] buffer = new byte[bufferSize];
				
				for (int length = 0; (length = input.read(buffer)) > 0;) {
					output.write(buffer, 0, length);
				}
				output.close();
				input.close();
			}
		} catch(Exception e){
		    e.printStackTrace();
		}
	}
	
}
