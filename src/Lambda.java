import java.util.Scanner;

public class Lambda {
	static Scanner scan = new Scanner(System.in);
	 public static void main(String[] args) { 
         String[] data = { 
               "���� �� Ű���尡 �ƴ� ����?`2`final`True`if`public", 
               "���� �� �ڹ��� �����ڰ� �ƴ� ����?`5`&`|`++`!=`/`^", 
               "���� �� �޼����� ��ȯ���� ������ �ǹ��ϴ� Ű�����?`1`void`null`false", 
         }; 
         
         int answerCount = 0;
         for(int i=0;i<data.length;i++) {
              // 1. StringŬ������ String[] split(String regex, int limit)�� ����ؼ� ������ �������� ��������.
              // 2. ������ ����ϼ���.
              // 3. �������� ������ ���� String[] split(String regex)�� ����ϼ���.
              // 4.�ݺ����� �̿��ؼ� �������� ����ϼ���.
       	  
	       	  String question 	= data[i].split("`")[0];
	       	  String answer   	= data[i].split("`")[1];
	       	  String[] keyWord  = data[i].split("`");
	       	  String userAnswer = null;
	       	  System.out.printf("[%d] %s\n",(i+1),question);
	       	  for(int j=2; j<keyWord.length; j++) {
	       		  System.out.printf("%d.%s\t",j-1,keyWord[j]);
	       	  }
	       	  userAnswer = scan.next();
	       	  if(userAnswer.equals(answer)) answerCount++;
	       	  System.out.printf("[��]%s",userAnswer);
	       	  System.out.println();
	       	  System.out.println();
         }
         System.out.printf("���䰳��/��ü���׼� :%d/%d",answerCount,data.length);
   } // main 
}

