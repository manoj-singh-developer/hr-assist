FROM ruby:2.3.3

WORKDIR /usr/src/app/
RUN apt-get update && apt-get install nodejs -y

ADD cmd.sh /home/
RUN chmod +x /home/cmd.sh
RUN gem install shutup

VOLUME /usr/src/app/

EXPOSE 3000

CMD ["/home/cmd.sh"]