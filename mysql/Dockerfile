FROM mysql:latest

# MySQL 설정을 위한 환경 변수
ENV MYSQL_ROOT_PASSWORD=root1234
ENV MYSQL_DATABASE=val

# 초기 SQL 스크립트 복사
COPY init.sql /docker-entrypoint-initdb.d/

# 포트 노출 (선택 사항)
EXPOSE 3306

CMD ["mysqld"]