using S3OperationManager.Models;

namespace S3OperationManager.Interfaces
{
    public interface IStorageService
    {
        Task<S3ResponseDto> UploadFileAsync(S3Data obj);
        Task<S3ResponseDto> GetPreSignedURLasync(S3Data obj);
    }
}
