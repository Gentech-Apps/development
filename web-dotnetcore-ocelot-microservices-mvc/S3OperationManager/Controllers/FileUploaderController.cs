using Microsoft.AspNetCore.Mvc;
using S3OperationManager.Interfaces;
using S3OperationManager.Models;

namespace S3OperationManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploaderController : ControllerBase
    {
        private readonly IStorageService _storageService;

        public FileUploaderController(IStorageService storageService)
        {
            _storageService = storageService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] S3RequestDto s3Request)
        {
            
            await using var memoryStream = new MemoryStream();
            await s3Request.file.CopyToAsync(memoryStream);
            var docName = s3Request.path + "/" + s3Request.file.FileName;
            
            
            S3Data s3Obj = new S3Data()
            {
                BucketName = "s3-dev-bucket",
                InputStream = memoryStream,
                Name = docName
            };
            var result = await _storageService.UploadFileAsync(s3Obj);

            return Ok(result);
        }
        [HttpPost]
        [Route("GetPreSignedURLForFileUpload")]
        public async Task<IActionResult> GetPreSignedURL([FromForm] S3RequestDto s3Request)
        {

            //await using var memoryStream = new MemoryStream();
            //await s3Request.file.CopyToAsync(memoryStream);
            var docName = s3Request.path + "/" + s3Request.fileName;


            S3Data s3Obj = new S3Data()
            {
                BucketName = "s3-dev-bucket",
                //InputStream = memoryStream,
                Name = docName
            };
            var result = await _storageService.GetPreSignedURLasync(s3Obj);

            return Ok(result);
        }
    }
}
