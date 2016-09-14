
/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/

INSERT INTO [User] ([FullName],[Email],[Password])
VALUES ('Administrator', 'admin', '1000:YmBR2FURIAPFKzn4V7VkiRoU07AOZ3i9:apX3ud4/WOBTaLZv7JSoI3nxqArzYDhX')
