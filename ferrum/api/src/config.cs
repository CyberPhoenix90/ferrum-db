namespace ferrum_api;

public class APIConfig
{
    public string ip;
    public int port;
    public int grpcMaxMessageLength;
    public string? sslCertificate;
    public string? sslPassword;
}