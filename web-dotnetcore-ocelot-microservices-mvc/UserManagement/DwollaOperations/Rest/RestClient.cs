﻿using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace UserManagement.DwollaOperations.Rest

{
    public interface IRestClient
    {
        Task<RestResponse<T>> SendAsync<T>(HttpRequestMessage request, HttpClient httpClient);
    }

    public class RestClient : IRestClient
    {
        private readonly IResponseBuilder _builder;

        public RestClient(JsonSerializerOptions jsonSerializerOptions) : this(new ResponseBuilder(jsonSerializerOptions))
        {
        }

        public async Task<RestResponse<T>> SendAsync<T>(HttpRequestMessage request, HttpClient httpClient)
        {
            try
            {
                using (var response = await httpClient.SendAsync(request))
                {
                    return await _builder.Build<T>(response);
                }
            }
            catch (Exception e)
            {
                return _builder.Error<T>(null, "HttpClientException", e.Message);
            }
        }

        internal RestClient(IResponseBuilder builder)
        {
            _builder = builder;
        }
    }
}