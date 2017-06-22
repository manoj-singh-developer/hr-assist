class DeployController < ApplicationController

    skip_before_action :verify_authenticity_token

    attr_accessor :branch
    attr_accessor :path
    attr_accessor :commands

    PULL_REQUEST    = 'pull_request'
    PUSH            = 'push'
    
    def index

        config = YAML::load_file(File.join(Rails.root, 'config', 'deploy.yml'))

        repo_url        = config['REPO_URL']
        branches        = config['BRANCHES']
        token           = config['TOKEN']
        common_commands = config['COMMANDS']

        if !verify_signature(token, request.raw_post)
            render plain: "Signatures didn't match!", status: 422 and return
        end

        payload = params

        if request.headers["X-GitHub-Event"] == PULL_REQUEST && request.request_parameters['action'] == 'closed'
            @branch     = payload['pull_request']['base']['ref']
            payload_url = payload['pull_request']['head']['repo']['html_url']
        elsif request.headers["X-GitHub-Event"] == PUSH
            @branch     = payload['ref'].split("/").last
            payload_url = payload['repository']['url']
        else
            render plain: "Only push and pull_request events are supported! #{request.request_parameters['action']}", status: 400 and return
        end

        if payload_url != repo_url || !branches.key?(@branch)
            render plain: "#{@branch} branch does not have any associated folder on server or repo is not correct", status: 400 and return
        end

        @commands   = branches[@branch]['commands'].merge(common_commands) {|key, b_commands, c_commands| [*b_commands, *c_commands] }
        @path       = branches[@branch]['path'];

        deploy

        render plain: "Successfully deployed from branch `#{@branch}` into directory `#{branches[@branch]['path']}`"
    end

    private
    def verify_signature(token, payload_body)

        if !request.headers['HTTP_X_HUB_SIGNATURE']
            return false
        end

        signature = 'sha1=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), token, payload_body)
        Rack::Utils.secure_compare(signature, request.headers['HTTP_X_HUB_SIGNATURE'])
    end

    def deploy
        Dir.chdir(@path) do
            @commands['before_pull'].each do |command|
                system command
            end

            system "git pull origin #{@branch}"

            @commands['after_pull'].each do |command|
                system command
            end
        end
    end

end
